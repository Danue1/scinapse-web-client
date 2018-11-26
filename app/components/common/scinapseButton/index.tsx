import * as React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as H from "history";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseButton.scss");

interface ScinapseButtonProps {
  content: string;
  gaCategory: string;
  isReactRouterLink?: boolean;
  isExternalLink?: boolean;
  type?: string;
  href?: string;
  to?: H.LocationDescriptor;
  style?: React.CSSProperties;
  onClick?: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
  disabled?: boolean;
  isLoading?: boolean;
}

class ScinapseButton extends React.PureComponent<ScinapseButtonProps> {
  public render() {
    const { type, content, isReactRouterLink, isExternalLink, to, href, style, disabled } = this.props;

    if (isReactRouterLink && to) {
      return (
        <Link style={style} onClick={this.handleClickEvent} className={styles.button} to={to}>
          {content}
        </Link>
      );
    } else if (isExternalLink && href) {
      return (
        <a style={style} onClick={this.handleClickEvent} className={styles.button} href={href}>
          {content}
        </a>
      );
    }

    return (
      <button
        type={type ? type : "button"}
        style={style}
        onClick={this.handleClickEvent}
        disabled={disabled}
        className={styles.button}
      >
        {this.getEventButtonContent()}
      </button>
    );
  }

  private getEventButtonContent = () => {
    const { content, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className={styles.spinnerWrapper}>
          <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
        </div>
      );
    }
    return content;
  };

  private handleClickEvent = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const { gaCategory, content, onClick } = this.props;

    trackEvent({
      category: gaCategory,
      action: `Click ${content}`,
      label: content,
    });

    if (onClick) {
      onClick(e);
    }
  };
}

export default withStyles<typeof ScinapseButton>(styles)(ScinapseButton);
