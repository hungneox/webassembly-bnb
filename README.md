# Install emscripten

Donwload [emsdk](https://github.com/emscripten-core/emsdk)

```
# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
./emsdk activate latest

source ./emsdk_env.sh
```

Add to .zshrc

```
source "/Path/to/emsdk/emsdk_env.sh"
```

# Compile

```
emcc filter.c -o filter.js
```

```
emcc -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" -s EXPORTED_FUNCTIONS="['_to_grayscale']" -s WASM=1 -o filter.js  filter.c
```