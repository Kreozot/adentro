### Стандартный стек вызовов при анимации:

* Element.fullAnimation
  * DanceAnimation.clearPaths
  * Element.drawPath
  * Element.startAnimation
    * Element.animationFunction
      * DanceAnimation.animateFigurePath
        * DanceAnimation.transformAtLength
          * DanceAnimation.positionFigure
            * DanceAnimation.smoothRotationAngle
            * DanceAnimation.rotateTopToPairFigure
        * DanceAnimation.changeFigureHands
        * Legs.animateFigureTime
          * Legs.animateFigureTimeZapateo
            * Legs.animateLegsRepeatZapateo
          * Legs.animateFigureTimeSimple
            * Legs.animateLegsRepeat
          * Legs.animateFigureTimeZamba
            * Legs.animateLegsRepeatZamba
          * Legs.animateFigureTimeBasic
            * Legs.animateLegsRepeat
