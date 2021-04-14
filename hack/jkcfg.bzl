
JK = "//tools/bin:jk"

def gen_manifests(pkg_name, dep, gen_file, name = "gen_manifests"):
    """Generates manifests for a given controller-runtime project.
    pkg_name should be the bazel package name (e.g., scheduler)
    role_name is the name for the generated RBAC role
    """
    native.sh_binary(
        name = name,
        srcs = ["//hack:gen-manifests.sh"],
        args = [
            "$(location %s)" % JK,
            "$(locations %s)" % dep,
            gen_file,
            pkg_name,
        ],
        data = [
            JK,
            dep,
            "@npm//@dpu/jkcfg-k8s",
            "@npm//@dpu/tekton",
            "@npm//@jkcfg/kubernetes",
            "@npm//@jkcfg/std",
        ],
    )