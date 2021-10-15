import { Pipe, PipeTransform } from '@angular/core';
import { rssTicket } from './feedback.component';

@Pipe({
    name: 'feedbackFilter'
})

export class FeedbackFilterPipe implements PipeTransform {

    /**
     * FeedbackFilterPipe filters the rss Feed
     * @param rssTickets rss Feed
     * @param searchTerm search term
     * @returns filtered rss feed
     */
    public transform(rssTickets: rssTicket[], searchTerm: string): rssTicket[] {
        if (!rssTickets || !searchTerm) {
            return rssTickets;
        }
        const rssFiltered = rssTickets.filter((ticket) =>
            ticket.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            ticket.description.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        return rssFiltered;
    }
}
