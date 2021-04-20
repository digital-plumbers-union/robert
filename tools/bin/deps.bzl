"""Defines dependencies on binary (pre-compile) tools"""

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")

def install_tools():
    """Defines top-level tool install function.

    This function is imported into our WORKSPACE file to make Bazel
    aware of our tooling dependencies.

    To add a binary tool, create a new function that returns targets
    for Linux and OSX binaries, then include it in this file.
    """
    install_kubectl()
    install_bazel_tools()
    install_crane()
    install_jkcfg()

def install_kubectl():
    """Installs kubectl

    Installed via http_file instead of tools.go because kubectl repository is
    managed in a non-standard way.
    """
    http_file(
        name = "kubectl_linux",
        downloaded_file_path = "kubectl",
        executable = True,
        sha256 = "e8913069293156ddf55f243814a22d2384fc18b165efb6200606fdeaad146605",
        urls = ["https://storage.googleapis.com/kubernetes-release/release/v1.16.15/bin/linux/amd64/kubectl"],
    )
    http_file(
        name = "kubectl_osx",
        downloaded_file_path = "kubectl",
        executable = True,
        sha256 = "aff54bfaaed905813f61a2d0ca039176d6d309e59f92ebdb297c7da1df105485",
        urls = ["https://storage.googleapis.com/kubernetes-release/release/v1.16.15/bin/darwin/amd64/kubectl"],
    )

def install_bazel_tools():
    """Install additional tools related to Bazel

    These are not installed via tools.go because of their dependency on protobuf.
    """
    http_file(
        name = "buildifier_osx",
        sha256 = "3c30fcddfea8b515fff75127788c16dca5d901873ec4cf2102225cccbffc1702",
        executable = 1,
        urls = ["https://github.com/bazelbuild/buildtools/releases/download/3.4.0/buildifier.mac"],
    )

    http_file(
        name = "buildifier_linux",
        sha256 = "5d47f5f452bace65686448180ff63b4a6aaa0fb0ce0fe69976888fa4d8606940",
        executable = 1,
        urls = ["https://github.com/bazelbuild/buildtools/releases/download/3.4.0/buildifier"],
    )

def install_crane():
    """Installs github.com/google/go-containerregistry/cmd/crane binaries. Used for tagging images."""

    http_archive(
        name = "crane_linux",
        build_file_content = """
package(default_visibility = ["//visibility:public"])
load("@rules_pkg//:pkg.bzl", "pkg_tar")
# provide a pkg_tar target so that crane can be added to a docker image, e.g.,
# for CI or other automation
pkg_tar(
  name = "tar"  ,
  # contents of this zip are in dir go-containerregistry_Linux_x86_64/
  srcs = ["crane"],
  extension = "tar.gz",
  mode = "755",
  package_dir = "/usr/bin/crane/",
  strip_prefix = "go-containerregistry_Linux_x86_64/"
)
filegroup(
  name = "file",
  srcs = ["crane"],
  visibility = ["//visibility:public"]
)
""",
        urls = ["https://github.com/google/go-containerregistry/releases/download/v0.4.1/go-containerregistry_Linux_x86_64.tar.gz"],
    )
    http_archive(
        name = "crane_osx",
        build_file_content = """
package(default_visibility = ["//visibility:public"])
filegroup(
  name = "file",
  srcs = ["crane"],
  visibility = ["//visibility:public"]
)
""",
        urls = ["https://github.com/google/go-containerregistry/releases/download/v0.4.1/go-containerregistry_Darwin_x86_64.tar.gz"],
    )

def install_jkcfg():
    http_file(
        name = "jk_osx",
        sha256 = "e3311fb6ee6d34363484ddd964b8e648fdab35f88feaeacc00c150bd66c16999",
        executable = 1,
        urls = ["https://github.com/jkcfg/jk/releases/download/0.4.0/jk-darwin-amd64"],
    )

    http_file(
        name = "jk_linux",
        sha256 = "eb4a833d4aae8fce338b0374fffd0e321fa4641d75170de58491ee2e60d336d0",
        executable = 1,
        urls = ["https://github.com/jkcfg/jk/releases/download/0.4.0/jk-linux-amd64"],
    )