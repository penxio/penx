import Foundation

// C interface for C++ to call
@_cdecl("fn_listener_create")
public func fn_listener_create() -> UnsafeMutableRawPointer {
    let listener = FnListener()
    return Unmanaged.passRetained(listener).toOpaque()
}

@_cdecl("fn_listener_destroy")
public func fn_listener_destroy(_ ptr: UnsafeMutableRawPointer) {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeRetainedValue()
    _ = listener // Ensure reference is released
}

@_cdecl("fn_listener_check_permission")
public func fn_listener_check_permission(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.checkAccessibilityPermission()
}

@_cdecl("fn_listener_request_permission")
public func fn_listener_request_permission(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.requestAccessibilityPermission()
}

@_cdecl("fn_listener_start_listening")
public func fn_listener_start_listening(_ ptr: UnsafeMutableRawPointer, _ callback: @escaping (@convention(c) (UnsafePointer<CChar>?) -> Void)) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    
    return listener.startListening { message in
        message.withCString { cString in
            callback(UnsafePointer<CChar>(cString))
        }
    }
}

@_cdecl("fn_listener_stop_listening")
public func fn_listener_stop_listening(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.stopListening()
}

@_cdecl("fn_listener_is_listening")
public func fn_listener_is_listening(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.getListeningStatus()
}

@_cdecl("fn_listener_get_fn_key_code")
public func fn_listener_get_fn_key_code(_ ptr: UnsafeMutableRawPointer) -> UInt16 {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.getFnKeyCode()
}

@_cdecl("fn_listener_is_fn_pressed")
public func fn_listener_is_fn_pressed(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.isFnPressed()
}

@_cdecl("fn_listener_simulate_keydown")
public func fn_listener_simulate_keydown(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.simulateFnKeydown()
}

@_cdecl("fn_listener_simulate_keyup")
public func fn_listener_simulate_keyup(_ ptr: UnsafeMutableRawPointer) -> Bool {
    let listener = Unmanaged<FnListener>.fromOpaque(ptr).takeUnretainedValue()
    return listener.simulateFnKeyup()
} 