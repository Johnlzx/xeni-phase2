#!/bin/bash

# Claude Code Hook: Notify when human input is required
# Sends a macOS notification with sound

input_data=$(cat)
notification_type=$(echo "$input_data" | jq -r '.notification_type // "unknown"')
message=$(echo "$input_data" | jq -r '.message // "Claude Code needs your attention"')

case "$notification_type" in
  "permission_prompt")
    osascript -e "display notification \"$message\" with title \"Claude Code\" subtitle \"Permission Required\" sound name \"Glass\""
    ;;
  "idle_prompt")
    osascript -e "display notification \"Claude is waiting for your input\" with title \"Claude Code\" subtitle \"Input Required\" sound name \"Ping\""
    ;;
  *)
    osascript -e "display notification \"$message\" with title \"Claude Code\" sound name \"Pop\""
    ;;
esac

exit 0
