
JK = "//tools/bin:jk"

def jk_generate(
    name,
    compiled_js,
    generation_file,
    output_path,
    sanity,
    values = {},
    deps = [],
    asOneFile = False
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
        "-v"
    ] + set_args

    if asOneFile:
        tmpl_cmd = tmpl_cmd + ["--stdout"]

    tmpl_cmd = tmpl_cmd + [
        "bazel-out/host/bin/kube/manifests/%s" % generation_file,
    ] + set_args

    if asOneFile:
        tmpl_cmd = tmpl_cmd + ["> $@"]

    cmds = cmds + [" ".join(tmpl_cmd)]
    
    if not asOneFile:
        cmds = cmds + ["cp *.yaml $(@D)"]

    native.genrule(
        name = name,
        srcs = [compiled_js],
        outs = output_path,
        cmd = ";".join(cmds),
        tools = [JK, compiled_js] + deps,
    )