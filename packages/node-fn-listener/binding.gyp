{
  "targets": [
    {
      "target_name": "node_fn_listener",
      "conditions": [
        ['OS=="mac"', {
          "sources": [
            "src/native/fn-listener.cpp"
          ],
          "include_dirs": [
            "<!@(node -p \"require('nan').include\")"
          ],
          "xcode_settings": {
            "OTHER_CPLUSPLUSFLAGS": [
              "-std=c++20",
              "-stdlib=libc++"
            ],
            "OTHER_LDFLAGS": [
              "-framework", "Cocoa",
              "-framework", "ApplicationServices",
              "-framework", "Carbon"
            ],
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "CLANG_CXX_LIBRARY": "libc++",
            "MACOSX_DEPLOYMENT_TARGET": "10.15"
          },
          "actions": [
            {
              "action_name": "build_swift_library",
              "inputs": [
                "src/swift/FnListener.swift",
                "src/swift/FnListenerBridge.swift"
              ],
              "outputs": [
                "<(module_root_dir)/build/Release/libfn_listener.a"
              ],
              "action": [
                "swiftc",
                "-emit-library",
                "-o", "<(module_root_dir)/build/Release/libfn_listener.a",
                "-module-name", "FnListener",
                "src/swift/FnListener.swift",
                "src/swift/FnListenerBridge.swift",
                "-framework", "Cocoa",
                "-framework", "ApplicationServices",
                "-framework", "Carbon",
                "-static"
              ]
            }
          ],
          "libraries": [
            "<(module_root_dir)/build/Release/libfn_listener.a"
          ],
          "link_settings": {
            "library_dirs": [
              "<(module_root_dir)/build/Release"
            ]
          }
        }],
        ['OS!="mac"', {
          "sources": [
            "src/native/stub.cpp"
          ],
          "include_dirs": [
            "<!@(node -p \"require('nan').include\")"
          ]
        }]
      ]
    }
  ]
} 