import Foundation
import Cocoa
import ApplicationServices

public class FnListener {
    private var eventMonitor: Any?
    private var callback: ((String) -> Void)?
    private var isListening = false
    private var fnPressed = false
    
    public init() {}
    
    deinit {
        stopListening()
    }
    
    public func checkAccessibilityPermission() -> Bool {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue(): false]
        return AXIsProcessTrustedWithOptions(options as CFDictionary)
    }
    
    public func requestAccessibilityPermission() -> Bool {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue(): true]
        return AXIsProcessTrustedWithOptions(options as CFDictionary)
    }
    
    public func startListening(_ callback: @escaping (String) -> Void) -> Bool {
        if isListening {
            return false
        }
        
        guard checkAccessibilityPermission() else {
            print("Accessibility permission required")
            return false
        }
        
        self.callback = callback
        isListening = true
        
        eventMonitor = NSEvent.addGlobalMonitorForEvents(matching: [.flagsChanged]) { [weak self] event in
            self?.handleFlagsChanged(event)
        }
        
        return true
    }
    
    public func stopListening() -> Bool {
        if let monitor = eventMonitor {
            NSEvent.removeMonitor(monitor)
            eventMonitor = nil
        }
        
        isListening = false
        callback = nil
        return true
    }
    
    public func getListeningStatus() -> Bool {
        return isListening
    }
    
    public func getFnKeyCode() -> UInt16 {
        return 63 // Fn key code
    }
    
    public func isFnPressed() -> Bool {
        return fnPressed
    }
    
    public func simulateFnKeydown() -> Bool {
        let message = "keydown:\(getFnKeyCode()):\(Date().timeIntervalSince1970)"
        callback?(message)
        return true
    }
    
    public func simulateFnKeyup() -> Bool {
        let message = "keyup:\(getFnKeyCode()):\(Date().timeIntervalSince1970)"
        callback?(message)
        return true
    }
    
    private func handleFlagsChanged(_ event: NSEvent) {
        let currentFnPressed = (event.modifierFlags.rawValue & NSEvent.ModifierFlags.function.rawValue) != 0
        
        if currentFnPressed != fnPressed {
            fnPressed = currentFnPressed
            print("Fn key state changed: \(currentFnPressed)")
            
            let message = "\(fnPressed ? "keydown" : "keyup"):\(getFnKeyCode()):\(Date().timeIntervalSince1970)"
            callback?(message)
        }
    }
} 