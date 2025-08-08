// Stub implementations for non-Mac platforms
// This file provides dummy implementations that don't require nan.h

#include <node.h>
#include <string>

using namespace v8;

// Stub implementations for non-Mac platforms
// These functions provide the same API but return appropriate fallback values

void CheckAccessibilityPermission(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void RequestAccessibilityPermission(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void StartListening(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void StopListening(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void IsListening(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void GetFnKeyCode(const FunctionCallbackInfo<Value>& args) {
    // Return default fn key code (63 is common for fn key)
    args.GetReturnValue().Set(63);
}

void IsFnPressed(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void SimulateFnKeydown(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void SimulateFnKeyup(const FunctionCallbackInfo<Value>& args) {
    // Always return false on non-Mac platforms
    args.GetReturnValue().Set(false);
}

void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "checkAccessibilityPermission", CheckAccessibilityPermission);
    NODE_SET_METHOD(exports, "requestAccessibilityPermission", RequestAccessibilityPermission);
    NODE_SET_METHOD(exports, "startListening", StartListening);
    NODE_SET_METHOD(exports, "stopListening", StopListening);
    NODE_SET_METHOD(exports, "isListening", IsListening);
    NODE_SET_METHOD(exports, "getFnKeyCode", GetFnKeyCode);
    NODE_SET_METHOD(exports, "isFnPressed", IsFnPressed);
    NODE_SET_METHOD(exports, "simulateFnKeydown", SimulateFnKeydown);
    NODE_SET_METHOD(exports, "simulateFnKeyup", SimulateFnKeyup);
}

NODE_MODULE(node_fn_listener, Initialize) 