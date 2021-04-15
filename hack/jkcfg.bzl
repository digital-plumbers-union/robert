
JK = "//tools/bin:jk"

def gen_manifests(src, gen_file, output_path, node_modules, name = "gen_manifests"):
    
    native.sh_binary(
        name = name,
        srcs = ["//hack:gen-manifests.sh"],
        args = [
            "$(location %s)" % JK,
            gen_file,
            output_path,
        ],
        data = [
            JK,
            src,
            node_modules
        ],
    )