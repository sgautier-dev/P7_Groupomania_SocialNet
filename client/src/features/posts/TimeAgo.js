import { parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from "date-fns/locale";

const TimeAgo = ({ timestamp }) => {
    let timeAgo = ''
    if (timestamp) {
        const date = parseISO(timestamp)
        const timePeriod = formatDistanceToNow(date, { addSuffix: true, locale: fr })
        timeAgo = `${timePeriod}`
    }

    return (
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}
export default TimeAgo