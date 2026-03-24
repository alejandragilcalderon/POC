import type { ApodEntry, ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import type { ApodRecordDto } from "@/modules/apod/data/models/apod-response.dto";

function mapOne(dto: ApodRecordDto): ApodEntry {
  return {
    date: dto.date ?? "",
    title: dto.title ?? "",
    explanation: dto.explanation ?? "",
    url: dto.url ?? "",
    mediaType: dto.media_type ?? "unknown",
    hdUrl: dto.hdurl,
    copyright: dto.copyright,
    thumbnailUrl: dto.thumbnail_url,
  };
}

export class ApodMapper {
  static fromDto(raw: unknown): ApodPayload {
    if (Array.isArray(raw)) {
      return raw.map((r) => mapOne(r as ApodRecordDto));
    }
    return mapOne(raw as ApodRecordDto);
  }
}
