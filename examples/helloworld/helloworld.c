#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
char* helloworld() {
    return "Hello world\n";
}