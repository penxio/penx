// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "FnListener",
    platforms: [
        .macOS(.v10_15)
    ],
    products: [
        .library(
            name: "FnListener",
            targets: ["FnListener"]
        )
    ],
    targets: [
        .target(
            name: "FnListener",
            path: "."
        )
    ]
) 