package(default_visibility = ["//visibility:public"])
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@k8s_deploy//:defaults.bzl", "k8s_deploy")

k8s_deploy(
    name = "namespace",
    template = ":namespace.yaml",
    substitutions = {
        "%{namespace}": "{BUILD_USER}",
    }
)

k8s_deploy(
    name = "discord-token",
    template = ":discord-token.yaml",
    substitutions = {
        "%{bot-token}": "{DISCORD_BOT_TOKEN}",
    }
)

k8s_deploy(
    name = "ghcr-config",
    template = ":ghcr-config.yaml",
    substitutions = {
        "%{ghcr-config}": "{GHCR_CONFIG}",
    }
)

k8s_deploy(
    name = "default-sa",
    template = ":sa.yaml"
)

k8s_objects(
   name = "setup",
   objects = [
      ":namespace",
      ":discord-token",
      ":ghcr-config",
      ":default-sa"
   ]
)