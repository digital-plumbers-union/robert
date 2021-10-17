echo "BUILD_USER $USER"
discord_token=$(echo -n $DISCORD_BOT_TOKEN | base64)
echo "DISCORD_BOT_TOKEN $discord_token"

auth=$(echo $GH_USERNAME:$READ_GH_TOKEN | base64)
dockerconfig=$(echo "{\"auths\":{\"ghcr.io\":{\"auth\":\"$auth\"}}}" | base64)
echo "GHCR_CONFIG $dockerconfig"