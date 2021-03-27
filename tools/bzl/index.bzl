"""Simple module entrypoint to avoid multiple `load()` calls in consumers."""

load(
    "//tools/bzl:tools.bzl",
    _tool = "tool",
)
load(
    "//tools/bzl:platforms.bzl",
    _platforms = "platforms",
)

platforms = _platforms
tool = _tool
