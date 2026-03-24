import type { ApodFailure } from "@/modules/apod/domain/ports/apod-repository.port";
import { strings } from "@/shared/resources";
import { FriendlyErrorBanner } from "@/shared/ui/components/friendly-error-banner";
import {
  formatUpstreamMessage,
  friendlyNetworkMessage,
} from "@/shared/ui/utils/format-api-error";

type Props = {
  failure: ApodFailure;
};

function mapApodFailure(failure: ApodFailure): { title: string; message: string } {
  switch (failure.kind) {
    case "unauthorized":
      return {
        title: strings.errors.unauthorizedTitle,
        message: strings.errors.unauthorizedBody,
      };
    case "network":
      return {
        title: strings.errors.networkTitle,
        message: friendlyNetworkMessage(failure.message),
      };
    case "upstream":
      return {
        title: strings.errors.apodUpstreamTitle,
        message: formatUpstreamMessage(failure.status, failure.message),
      };
  }
}

export function ApodErrorMessageWidget({ failure }: Props) {
  const { title, message } = mapApodFailure(failure);
  return <FriendlyErrorBanner title={title} message={message} />;
}
