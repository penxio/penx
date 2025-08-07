#include <nan.h>
#include <string>
#include <functional>

using namespace v8;

// Global callback function
static Nan::Persistent<v8::Function> globalCallback;

// C callback function for Swift to call
extern "C" void swift_callback(const char* message) {
    if (!globalCallback.IsEmpty()) {
        Nan::HandleScope scope;
        Local<Function> callback = Nan::New(globalCallback);
        Local<Value> argv[] = { Nan::New(std::string(message)).ToLocalChecked() };
        Nan::Call(callback, Nan::GetCurrentContext()->Global(), 1, argv);
    }
}

// Swift function declarations
extern "C" {
    void* fn_listener_create();
    void fn_listener_destroy(void* listener);
    bool fn_listener_check_permission(void* listener);
    bool fn_listener_request_permission(void* listener);
    bool fn_listener_start_listening(void* listener, void (*callback)(const char*));
    bool fn_listener_stop_listening(void* listener);
    bool fn_listener_is_listening(void* listener);
    uint16_t fn_listener_get_fn_key_code(void* listener);
    bool fn_listener_is_fn_pressed(void* listener);
    bool fn_listener_simulate_keydown(void* listener);
    bool fn_listener_simulate_keyup(void* listener);
}

class FnListenerWrapper {
private:
    void* listener;
    
public:
    FnListenerWrapper() {
        listener = fn_listener_create();
    }
    
    ~FnListenerWrapper() {
        if (listener) {
            fn_listener_destroy(listener);
        }
    }
    
    bool checkPermission() {
        return fn_listener_check_permission(listener);
    }
    
    bool requestPermission() {
        return fn_listener_request_permission(listener);
    }
    
    bool startListening(v8::Local<v8::Function> callback) {
        globalCallback.Reset(callback);
        return fn_listener_start_listening(listener, swift_callback);
    }
    
    bool stopListening() {
        return fn_listener_stop_listening(listener);
    }
    
    bool isListening() {
        return fn_listener_is_listening(listener);
    }
    
    uint16_t getFnKeyCode() {
        return fn_listener_get_fn_key_code(listener);
    }
    
    bool isFnPressed() {
        return fn_listener_is_fn_pressed(listener);
    }
    
    bool simulateKeydown() {
        return fn_listener_simulate_keydown(listener);
    }
    
    bool simulateKeyup() {
        return fn_listener_simulate_keyup(listener);
    }
};

// Global instance
static FnListenerWrapper* g_listener = nullptr;

// Node.js function implementations
NAN_METHOD(CheckAccessibilityPermission) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    bool result = g_listener->checkPermission();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(RequestAccessibilityPermission) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    bool result = g_listener->requestPermission();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(StartListening) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    if (info.Length() < 1 || !info[0]->IsFunction()) {
        Nan::ThrowTypeError("Function expected");
        return;
    }
    
    bool result = g_listener->startListening(info[0].As<Function>());
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(StopListening) {
    if (!g_listener) {
        info.GetReturnValue().Set(Nan::New(false));
        return;
    }
    
    bool result = g_listener->stopListening();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(IsListening) {
    if (!g_listener) {
        info.GetReturnValue().Set(Nan::New(false));
        return;
    }
    
    bool result = g_listener->isListening();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(GetFnKeyCode) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    uint16_t result = g_listener->getFnKeyCode();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(IsFnPressed) {
    if (!g_listener) {
        info.GetReturnValue().Set(Nan::New(false));
        return;
    }
    
    bool result = g_listener->isFnPressed();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(SimulateFnKeydown) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    bool result = g_listener->simulateKeydown();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_METHOD(SimulateFnKeyup) {
    if (!g_listener) {
        g_listener = new FnListenerWrapper();
    }
    
    bool result = g_listener->simulateKeyup();
    info.GetReturnValue().Set(Nan::New(result));
}

NAN_MODULE_INIT(Init) {
    Nan::Export(target, "checkAccessibilityPermission", CheckAccessibilityPermission);
    Nan::Export(target, "requestAccessibilityPermission", RequestAccessibilityPermission);
    Nan::Export(target, "startListening", StartListening);
    Nan::Export(target, "stopListening", StopListening);
    Nan::Export(target, "isListening", IsListening);
    Nan::Export(target, "getFnKeyCode", GetFnKeyCode);
    Nan::Export(target, "isFnPressed", IsFnPressed);
    Nan::Export(target, "simulateFnKeydown", SimulateFnKeydown);
    Nan::Export(target, "simulateFnKeyup", SimulateFnKeyup);
}

NODE_MODULE(node_fn_listener, Init) 