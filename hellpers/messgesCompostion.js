export const INTRACTIVE_FAILED_MESSAGE = (data) =>{
    return  {
	"blocks": [
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": data.text
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "start",
						"emoji": true
					},
					"value"      : "start_action",
					"action_id"  : `@${data.serverData.server.ServerName} @${data.serverData.searchService} start_action`
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "stop",
						"emoji": true
					},
					"value": "stop_action",
					"action_id"  : `@${data.serverData.server.ServerName} @${data.serverData.searchService} stop_action`
					
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "restart",
						"emoji": true
					},
					"value": "restart_action",
					"action_id"  : `@${data.serverData.server.ServerName} @${data.serverData.searchService} restart_action`
				}
			]
		}
	]
}}

export const INTRACTIVE_ACTION_MESSAGE = (data) => {
	return {
	 "message_type":data.InChannel?"channel":"ephermal",
	   "ok": true,
	   "channel": data.channel,
	   "ts": data.ts,
	   "text": data.text
   }
}