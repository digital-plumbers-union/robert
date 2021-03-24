package(default_visibility=["//visibility:public"])
load("@npm//@bazel/typescript:index.bzl", "ts_library")

ts_library(
    name = "compile",
    srcs = glob(["*.ts"]),
    module_name = "discord-manager",
    deps = [
      "@npm//@jkcfg/kubernetes",
      "@npm//@jkcfg/std",
      "@npm//@types/bent",
      "@npm//@types/convict",
      "@npm//@dpu/jkcfg-k8s",
      "@npm//@dpu/tekton",
      "@npm//bent",
      "@npm//convict",
      "@npm//discord.js",
      "@npm//@kubernetes/client-node",
    ],
)

load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

nodejs_image(
    name = "image-build",
    entry_point = ":index.ts",
    data = [":compile"],
)

container_push(
    name = "image-push",
    format = "Docker",
    image = ":image-build",
    registry = "ghcr.io",
    repository = "digital-plumbers-union/robert",
    tag = "dev"
)
