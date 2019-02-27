function filter(imageData) {
    const {
        data,
        width,
        height
    } = imageData;
    const bufferPointerIn = 0;
    const bufferPointerOut = width * height * 4;
    const bufferIn = new Uint8Array(Module.buffer, bufferPointerIn, width * height * 4);
    const bufferOut = new Uint8Array(Module.buffer, bufferPointerOut, width * height * 4);
    bufferIn.set(data);
    Module._to_grayscale(bufferPointerIn, bufferPointerOut, width, height);
    data.set(bufferOut);
    return data;
}

function renderSource(source, destination) {
    const context = destination.getContext('2d');
    context.drawImage(source, 0, 0, destination.width, destination.height);

    const imageData = context.getImageData(0, 0, destination.width, destination.height);
    imageData.data.set(filter(imageData));
    context.putImageData(imageData, 0, 0);

    requestAnimationFrame(_ => renderSource(source, destination));
}

async function main() {
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    });

    video.setAttribute(`width`, 640);
    video.setAttribute(`height`, 480);
    video.srcObject = stream;
    video.play();

    const image = document.querySelector('#image');
    requestAnimationFrame(_ => renderSource(video, image));
}

main().catch(console.error);