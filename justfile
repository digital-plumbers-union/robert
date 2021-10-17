dev-image workspace package tag="local":
    bazel run --platforms @build_bazel_rules_nodejs//toolchains/node:linux_amd64 //{{workspace}}/{{package}}:image-push
    bazel run //:crane tag ghcr.io/digital-plumbers-union/robert/{{package}}:dev {{local}}
