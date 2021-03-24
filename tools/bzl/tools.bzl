"""Macros for managing tools"""

def tool(name, outs, darwin, k8, tags = [], cmd = "cp $(SRCS) $@"):
    """Macro for easily creating build target for a binary tool"""
    native.genrule(
        name = name,
        srcs = select({
            ":darwin": [darwin],
            ":k8": [k8],
        }),
        outs = outs,
        cmd = cmd,
        tags = tags,
        visibility = ["//visibility:public"],
    )
