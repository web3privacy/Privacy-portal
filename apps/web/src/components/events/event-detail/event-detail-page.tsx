"use client";

import type { Event } from "@/types/events";
import type { EventDetail, EventDetailSpeaker } from "@/types/event-detail";
import type { Talk } from "@/types/academy";
import type { Article } from "@/types/news";
import { DetailHero } from "./detail-hero";
import { DetailTopicsLinks } from "./detail-topics-links";
import { DetailSpeakers } from "./detail-speakers";
import { DetailExperience } from "./detail-experience";
import { DetailLocation } from "./detail-location";
import { DetailSchedule } from "./detail-schedule";
import { DetailEventMap } from "./detail-event-map";
import { DetailGallery } from "./detail-gallery";
import { DetailTickets } from "./detail-tickets";
import { DetailVideos } from "./detail-videos";
import { DetailArticles } from "./detail-articles";
import { DetailFaq } from "./detail-faq";
import { DetailSponsors } from "./detail-sponsors";
import { DetailContributors } from "./detail-contributors";

type Props = {
  event: Event;
  detail: EventDetail | null;
  speakers: EventDetailSpeaker[];
  talks: Talk[];
  articles: Article[];
};

export function EventDetailPage({ event, detail, speakers, talks, articles }: Props) {
  const showTopicsLinks =
    (detail?.topics?.enabled && detail.topics.content) ||
    detail?.links ||
    event.links?.web ||
    event.links?.rsvp;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1117]">
      <DetailHero event={event} detail={detail} />

      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-8 md:px-6 lg:max-w-[75vw]">
        {showTopicsLinks && (
          <DetailTopicsLinks
            topics={detail?.topics}
            baseLinks={event.links}
            detailLinks={detail?.links}
          />
        )}

        <div className="space-y-0 divide-y divide-[#e0e0e0] dark:divide-[#1f2937]">
          <DetailSpeakers speakers={speakers} />
          {detail?.experience && <DetailExperience section={detail.experience} />}
          <DetailLocation event={event} location={detail?.location} />
          {detail?.schedule && <DetailSchedule section={detail.schedule} />}
          {detail?.eventMap && <DetailEventMap section={detail.eventMap} />}
          {detail?.gallery && <DetailGallery section={detail.gallery} />}
          {detail?.tickets && <DetailTickets section={detail.tickets} />}
          {detail?.videos && (
            <DetailVideos
              section={detail.videos}
              talks={talks}
              youtubeIds={detail.videos.youtubeIds}
            />
          )}
          {detail?.articles && (
            <DetailArticles section={detail.articles} articles={articles} />
          )}
          {detail?.faq && <DetailFaq section={detail.faq} />}
          {detail?.sponsors && <DetailSponsors section={detail.sponsors} />}
          {detail?.contributors && (
            <DetailContributors section={detail.contributors} />
          )}
        </div>
      </div>
    </div>
  );
}
