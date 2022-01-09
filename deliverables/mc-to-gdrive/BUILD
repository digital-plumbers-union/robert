package(default_visibility = ["//visibility:public"])

load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@k8s_deploy//:defaults.bzl", "k8s_deploy")
load("//hack:jkcfg.bzl", "jk_generate")

ts_library(
    name = "compile",
    srcs = glob(["*.ts"], ["manifest.ts"]),
    module_name = "ping",
    deps = [
        "@npm//convict",
        "@npm//discord.js",
        "@npm//@jkcfg/kubernetes",
        "@npm//@types/node",
        "@npm//@types/convict",
        "@npm//googleapis",
        "@npm//tar-fs",
        "@npm//zlib",
        "@npm//@types/tar-fs",
        "@npm//@kubernetes/client-node"
    ],
)

ts_library(
    name = "manifest_build",
    srcs = ["manifest.ts"],
    deps = [
        "//kube/manifests",
        "@npm//@jkcfg/kubernetes",
        "@npm//@types/node"
    ],
    runtime = "node",
    # force ts_library to always produce ES6 compatible outputs because
    # this code will always be consumed by `jk`
    devmode_module = "es2015",
    devmode_target = "es2017",
    tsconfig = "//kube:tsconfig.json"
)

filegroup(
    name = "compiled_manifests",
    srcs = ["manifest_build"],
    output_group = "es5_sources"
)

load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

nodejs_image(
    name = "image-build",
    data = [":compile"],
    entry_point = ":index.ts",
)

container_push(
    name = "image-push",
    format = "Docker",
    image = ":image-build",
    registry = "ghcr.io",
    repository = "digital-plumbers-union/robert/mc-to-gdrive",
    tag = "dev",
)

jk_generate(
    name="command_manifest",
    compiled_js=":compiled_manifests",
    generation_file="deliverables/mc-to-gdrive/manifest.js",
    output_path=["config.yaml"],
    deps = [
        "@npm//@dpu/jkcfg-k8s",
        "@npm//@dpu/tekton",
        "@npm//@jkcfg/kubernetes",
        "@npm//@jkcfg/std",
        "@npm//@types/node",
        "//kube/manifests:compiled_manifests"
    ]
)

k8s_deploy(
    name = "mc-to-gdrive",
    # Build images with the same container
    images = {
        "ghcr.io/digital-plumbers-union/robert/mc-to-gdrive": ":image-build",
    },
    # K8s deployment template with a stamping variable to replace
    template = ":command_manifest",
)
