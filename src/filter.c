#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void to_grayscale(unsigned char *buffer_in, unsigned char *buffer_out, unsigned int width, unsigned int height)
{
    for (int y = 0; y < (int)height; ++y)
    {
        for (int x = 0; x < (int)width; ++x)
        {
            int redIndex = (y * width + x) * 4;
            int greenIndex = redIndex + 1;
            int blueIndex = redIndex + 2;
            int alphaIndex = redIndex + 3;
            float average = (buffer_in[redIndex] + buffer_in[greenIndex] + buffer_in[blueIndex]) / 3;
            buffer_out[redIndex] = average;
            buffer_out[greenIndex] = average;
            buffer_out[blueIndex] = average;
            buffer_out[alphaIndex] = 255;
        }
    }
}