"""Defines a reusable macro for config_settings based on host machine"""

def platforms(name = "tool_platforms"):
    native.config_setting(
        name = "k8",
        values = {"host_cpu": "k8"},
        visibility = ["//visibility:private"],
    )

    native.config_setting(
        name = "darwin",
        values = {"host_cpu": "darwin"},
        visibility = ["//visibility:private"],
    )
