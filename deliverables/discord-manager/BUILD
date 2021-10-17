package(default_visibility = ["//visibility:public"])

load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@k8s_deploy//:defaults.bzl", "k8s_deploy")

ts_library(
    name = "compile",
    srcs = glob(["*.ts"]),
    module_name = "discord-manager",
    deps = [
        "@npm//@dpu/jkcfg-k8s",
        "@npm//@dpu/tekton",
        "@npm//@jkcfg/kubernetes",
        "@npm//@jkcfg/std",
        "@npm//@kubernetes/client-node",
        "@npm//@types/bent",
        "@npm//@types/convict",
        "@npm//bent",
        "@npm//convict",
        "@npm//discord.js",
    ],
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
    repository = "digital-plumbers-union/robert/discord-manager",
    tag = "dev",
)

k8s_deploy(
    name = "discord-manager-deployment",
    # Build images with the same container
    images = {
        "ghcr.io/digital-plumbers-union/robert/discord-manager:dev": ":image-build",
    },
    # K8s deployment template with a stamping variable to replace
    template = "//kube/manifests:discord-manager",
)


k8s_deploy(
    name = "discord-manager-sa",
    template = "//kube/manifests:discord-manager-sa"
)

k8s_objects(
   name = "discord-manager",
   objects = [
      ":discord-manager-deployment",
      ":discord-manager-sa",
   ]
)