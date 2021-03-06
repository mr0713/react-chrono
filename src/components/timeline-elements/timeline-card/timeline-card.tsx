import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TimelineCardModel } from '../../../models/TimelineItemModel';
import TimelineItemContent from '../timeline-card-content/timeline-card-content';
import TimelineItemTitle from '../timeline-item-title/timeline-card-title';
import {
  TimelineContentContainer,
  TimelinePoint,
  TimelinePointWrapper,
  TimelineTitleContainer,
  Wrapper,
} from './timeline-card.styles';

const TimelineItem: React.FunctionComponent<TimelineCardModel> = ({
  active,
  autoScroll,
  cardHeight,
  contentDetailedText,
  contentText,
  contentTitle,
  id,
  media,
  mode,
  onClick,
  onElapsed,
  position,
  slideItemDuration,
  slideShowRunning,
  theme,
  title,
  wrapperId,
}: TimelineCardModel) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (onClick && !slideShowRunning) {
      onClick(id);
    }
  };

  useEffect(() => {
    if (active) {
      const circle = circleRef.current;
      const wrapper = wrapperRef.current;
      const content = contentRef.current;

      if (circle && wrapper) {
        const circleOffsetLeft = circle.offsetLeft;
        const wrapperOffsetLeft = wrapper.offsetLeft;
        const circleOffsetTop = circle.offsetLeft;
        const wrapperOffsetTop = wrapper.offsetTop;

        if (mode === 'HORIZONTAL') {
          autoScroll({
            timelinePointOffset: circleOffsetLeft + wrapperOffsetLeft,
            timelinePointWidth: circle.clientWidth,
          });
        } else {
          autoScroll({
            timelinePointOffset: circleOffsetTop + wrapperOffsetTop,
            timelinePointHeight: circle.clientHeight,
            timelineContentHeight: content?.clientHeight,
            timelineContentOffset: wrapperOffsetTop,
          });
        }
      }
    }
  }, [active, autoScroll, mode]);

  const handleOnShowMore = () => {};

  const timelineContent = () => {
    let className = '';

    if (mode === 'HORIZONTAL') {
      className = `horizontal ${position === 'top' ? 'bottom' : 'top'}`;
    } else {
      className = 'vertical';
    }

    return (
      <TimelineContentContainer className={className} ref={contentRef}>
        {mode === 'VERTICAL' && (
          <TimelineTitleContainer
            data-testid="timeline-title"
            className={`${mode.toLowerCase()} ${position}`}
          >
            <TimelineItemTitle title={title} active={active} theme={theme} />
          </TimelineTitleContainer>
        )}
        <TimelineItemContent
          content={contentText}
          active={active}
          title={contentTitle}
          detailedText={contentDetailedText}
          onShowMore={handleOnShowMore}
          theme={theme}
          slideShowActive={slideShowRunning}
          media={media}
          mode={mode}
          cardHeight={cardHeight}
          slideItemDuration={slideItemDuration}
          onElapsed={onElapsed}
          id={id}
        />
      </TimelineContentContainer>
    );
  };

  const showTimelineContent = () => {
    const ele = document.getElementById(wrapperId);

    if (ele) {
      return ReactDOM.createPortal(timelineContent(), ele);
    }
  };

  return (
    <Wrapper
      ref={wrapperRef}
      className={mode.toLowerCase()}
      data-testid="timeline-item"
    >
      {mode === 'HORIZONTAL' && active ? showTimelineContent() : null}

      <TimelinePointWrapper>
        <TimelinePoint
          className={`${mode.toLowerCase()} ${active ? 'active' : 'in-active'}`}
          onClick={handleClick}
          ref={circleRef}
          data-testid="timeline-circle"
          theme={theme}
        ></TimelinePoint>
      </TimelinePointWrapper>

      {mode === 'HORIZONTAL' && (
        <TimelineTitleContainer
          className={`${mode.toLowerCase()} ${position}`}
          data-testid="timeline-title"
        >
          <TimelineItemTitle title={title} active={active} theme={theme} />
        </TimelineTitleContainer>
      )}
      {mode === 'VERTICAL' && timelineContent()}
    </Wrapper>
  );
};

export default TimelineItem;
