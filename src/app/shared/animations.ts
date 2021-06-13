import {
  trigger,
  animate,
  transition,
  style,
  state,
  query,
  animateChild,
  group,
  AnimationTransitionMetadata
} from '@angular/animations';
import {routes} from '../app-routing.module';

const orderedPageNames = routes
  .filter(route => route.data !== undefined && route.data.hasOwnProperty('name'))
  .map(route => route?.data?.name);

export const toastSlideInOutAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('toastSlideInOutAnimation', [

    // end state styles for route container (host)
    state('*', style({
      // the view covers the whole screen with a semi tranparent background
      position: 'fixed',
      right: 0,
      opacity: 0.8
    })),

    // route 'enter' transition
    transition(':enter', [

      // styles at start of transition
      style({
        // start with the content positioned off the right of the screen,
        // -400% is required instead of -100% because the negative position adds to the width of the element
        right: '-400%',

        // start with background opacity set to 0 (invisible)
        opacity: 0
      }),

      // animation and styles at end of transition
      animate('.5s ease-in-out', style({
        // transition the right position to 0 which slides the content into view
        right: 0,

        // transition the background opacity to 0.8 to fade it in
        opacity: 0.8
      }))
    ]),

    // route 'leave' transition
    transition(':leave', [
      // animation and styles at end of transition
      animate('.5s ease-in-out', style({
        // transition the right position to -400% which slides the content out of view
        right: '-400%',

        // transition the background opacity to 0 to fade it out
        opacity: 0
      }))
    ])
  ]);

const stepsToLeft = [
    style({position: 'relative'}),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 1,
        transform: 'scale(1)',
        width: '100%'
      })
    ]),
    query(':enter', [
      style({left: '-100%', opacity: 0})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({left: '100%', opacity: 0}))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({left: '0%', opacity: 1}))
      ])
    ]),
    query(':enter', animateChild()),
  ]
;

const stepsToRight = [
  style({position: 'relative'}),
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      right: 0,
      opacity: 1,
      width: '100%'
    })
  ]),
  query(':enter', [
    style({right: '-100%', opacity: 0})
  ]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate('300ms ease-out', style({right: '100%', opacity: 0}))
    ]),
    query(':enter', [
      animate('300ms ease-out', style({right: '0%', opacity: 1}))
    ])
  ]),
  query(':enter', animateChild()),
];

function getPageSlideTransitions(): AnimationTransitionMetadata[] {
  const transitions: AnimationTransitionMetadata[] = [];

  for (let p1 = 0; p1 < orderedPageNames.length; p1++) {
    for (let p2 = 0; p2 < orderedPageNames.length; p2++) {
      if (p1 === p2) {
        continue;
      }

      const page1 = orderedPageNames[p1];
      const page2 = orderedPageNames[p2];
      if (p1 < p2) {
        transitions.push(transition(`${page1} => ${page2}`, stepsToRight));
      } else {
        transitions.push(transition(`${page1} => ${page2}`, stepsToLeft));
      }
    }
  }

  return transitions;
}

export const slideInAnimation = trigger('routeAnimations', getPageSlideTransitions());
