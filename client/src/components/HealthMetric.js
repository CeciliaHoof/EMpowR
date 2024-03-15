import { Feed, Icon } from "semantic-ui-react"


function HealthMetric({ metric }){
    const { comment, metric_type, time_taken, content } = metric

    return (
        <Feed.Event style={{display: 'block'}}>
            <Feed.Content>
                <Feed.Summary>{metric_type.units ? `🩺 ${metric_type.metric_type}: ${content} ${metric_type.units}.` : `🩺 ${metric_type.metric_type}: ${content}`} <Feed.Date>{time_taken}</Feed.Date> </Feed.Summary>
                
            </Feed.Content>
            {comment && <Feed.Extra text>{comment}</Feed.Extra>}
            <Feed.Meta>
                <Icon name="pencil"/>
            </Feed.Meta>
        </Feed.Event>
    )
}

export default HealthMetric