#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void to_grayscale(unsigned char *buffer_in, unsigned char *buffer_out, unsigned int width, unsigned int height)
{
    for (int y = 0; y < (int)height; ++y)
    {
        for (int x = 0; x < (int)width; ++x)
        {
            int index = (y * width + x) * 4;
            int average = (int)(buffer_in[index] + buffer_in[index + 1] + buffer_in[index + 2]) / 3;
            buffer_out[index] = average;
            buffer_out[index + 1] = average;
            buffer_out[index + 2] = average;
            buffer_out[index + 3] = 255;
        }
    }
}