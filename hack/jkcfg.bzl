
JK = "//tools/bin:jk"

def jk_generate(
    name,
    compiled_js,
    generation_file,
    output_path,
    sanity,
    values = {},
    deps = [],
):
    cmds = [
        "ln -s external/npm/node_modules node_modules"
    ]
    set_args = []

    for k, v in values.items():
        set_args = set_args + ["--parameter %s=%s" % (k, v)]

    tmpl_cmd = [
        "$(location %s)" % JK,
        "generate",
        "--stdout",
        "-v",
        "bazel-out/host/bin/kube/manifests/%s" % generation_file,
    ] + set_args + ["> $@"]
    cmds = cmds + [" ".join(tmpl_cmd)]
    native.genrule(
        name = name,
        srcs = [compiled_js],
        outs = [output_path],
        cmd = ";".join(cmds),
        tools = [JK, compiled_js] + deps,
    )