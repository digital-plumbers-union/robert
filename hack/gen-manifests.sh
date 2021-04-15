jk=$1
echo $@
extraParams=""
if [ -z "${4}" ] 
then
    echo "Provide a tag value via bazel run ... -- $tag"
    exit 1
fi
jk generate -v --stdout --parameter tag=$4 $2 > $3
cat $3