var streaming = false;
var videoInput = document.getElementById('video-input');
var btnStartStop = document.getElementById('btn-start-stop');
var canvasOutput = document.getElementById('canvas-output');
var canvasContext = canvasOutput.getContext('2d');
createFileFromUrl = function (path, url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function (ev) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let data = new Uint8Array(request.response);
                cv.FS_createDataFile('/', path, data, true, false, false);
                callback();
            } else {
                console.log('Failed to load ' + url + ' status: ' + request.status);
            }
        }
    };
    request.send();
};

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    console.log(cv.getBuildInformation());
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        btnStartStop.classList.remove('is-disabled');
        btnStartStop.removeAttribute('disabled');
    });
}

function processVideo() {
    const FPS = 30;

    var video = document.getElementById('video-input');
    var src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    var dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    var gray = new cv.Mat();
    var cap = new cv.VideoCapture(video);
    var faces = new cv.RectVector();
    var classifier = new cv.CascadeClassifier();

    // load pre-trained classifiers
    classifier.load('haarcascade_frontalface_default.xml');

    try {
        if (!streaming) {
            // clean and stop.
            src.delete();
            dst.delete();
            gray.delete();
            faces.delete();
            classifier.delete();
            return;
        }
        let begin = Date.now();
        // start processing.
        cap.read(src);
        src.copyTo(dst);
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // detect faces.
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        // draw faces.
        for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
        }
        cv.imshow('canvas-output', dst);
        // schedule the next one.
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.log(err);
    }
};

function startCamera(resolution, callback, videoId) {
    let self = this;
    const constraints = {
        'qvga': {
            width: {
                exact: 320
            },
            height: {
                exact: 240
            }
        },
        'vga': {
            width: {
                exact: 640
            },
            height: {
                exact: 480
            }
        }
    };
    let video = document.getElementById(videoId);
    if (!video) {
        video = document.createElement('video');
    }

    let videoConstraint = constraints[resolution];
    if (!videoConstraint) {
        videoConstraint = true;
    }

    navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: false
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            self.video = video;
            self.stream = stream;
            self.onCameraStartedCallback = callback;
            video.addEventListener('canplay', onVideoCanPlay, false);
        })
        .catch(function (err) {
            console.log('Camera Error: ' + err.name + ' ' + err.message);
        });
};

function onVideoCanPlay() {
    if (onCameraStartedCallback) {
        onCameraStartedCallback(self.stream, self.video);
    }
};

function stopCamera() {
    if (video) {
        video.pause();
        video.srcObject = null;
        video.removeEventListener('canplay', onVideoCanPlay);
    }
    if (stream) {
        stream.getVideoTracks()[0].stop();
    }
};

btnStartStop.addEventListener('click', () => {
    if (!streaming) {
        startCamera('qvga', onVideoStarted, 'video-input');
    } else {
        stopCamera();
        onVideoStopped();
    }
});

function onVideoStarted() {
    streaming = true;
    btnStartStop.innerText = 'Stop';
    videoInput.width = videoInput.videoWidth;
    videoInput.height = videoInput.videoHeight;
    processVideo()
}

function onVideoStopped() {
    streaming = false;
    canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
    btnStartStop.innerText = 'Start';
}