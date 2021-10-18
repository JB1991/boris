import { rssTicket } from './feedback.component';
import { FeedbackFilterPipe } from './feedbackFilter.pipe';

describe('FeedbackFilter', () => {
    let pipe: FeedbackFilterPipe;

    const rssFeed: rssTicket[] = [
        {
            title: 'title 1',
            description: 'description 1',
            date: '08.09.21, 10:00'
        },
        {
            title: 'title 2',
            description: 'description 2',
            date: '08.09.21, 10:00'
        }
    ];

    beforeEach(() => {
        pipe = new FeedbackFilterPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should filter the rss feed', () => {
        expect(pipe.transform(rssFeed, 'Title 1')).toEqual(
            [{
                title: 'title 1',
                description: 'description 1',
                date: '08.09.21, 10:00'
            }]
        );
    });

});
