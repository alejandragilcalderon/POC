import type { ApodFailure } from "@/modules/apod/domain/ports/apod-repository.port";
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
        title: "Access denied",
        message:
          "The backend rejected this request. If your API requires auth, sign in again or check your token.",
      };
    case "network":
      return {
        title: "Can’t reach the server",
        message: friendlyNetworkMessage(failure.message),
      };
    case "upstream":
      return {
        title: "Server or API error",
        message: formatUpstreamMessage(failure.status, failure.message),
      };
  }
}

export function ApodErrorMessageWidget({ failure }: Props) {
  const { title, message } = mapApodFailure(failure);
  return <FriendlyErrorBanner title={title} message={message} />;
}
