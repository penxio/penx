#include <nan.h>
#include <string>

using namespace v8;

// Stub implementations for non-Mac platforms
// These functions provide the same API but return appropriate fallback values

NAN_METHOD(CheckAccessibilityPermission) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(RequestAccessibilityPermission) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(StartListening) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(StopListening) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(IsListening) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(GetFnKeyCode) {
    // Return default fn key code (63 is common for fn key)
    info.GetReturnValue().Set(Nan::New(63));
}

NAN_METHOD(IsFnPressed) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(SimulateFnKeydown) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
}

NAN_METHOD(SimulateFnKeyup) {
    // Always return false on non-Mac platforms
    info.GetReturnValue().Set(Nan::New(false));
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