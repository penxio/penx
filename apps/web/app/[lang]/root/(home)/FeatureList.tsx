import { Trans } from '@lingui/react'
import {
  BotIcon,
  BugIcon,
  GithubIcon,
  KeyIcon,
  LocationEditIcon,
  MailIcon,
  MessageCircleMore,
  PaletteIcon,
  PencilIcon,
  RefreshCcwIcon,
  RocketIcon,
  TabletSmartphoneIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react'
import { cn } from '@penx/utils'

type FeatureItem = {
  icon?: any
  title: any
  description: any
}

// Version control backup

export function FeatureList() {
  const features: FeatureItem[] = [
    {
      icon: <LocationEditIcon size={24} />,
      title: <Trans id="Local-First"></Trans>,
      description: (
        <Trans
          id="Enhance your content creation with AI-powered tools and suggestions."
          message="Enhance your content creation with AI-powered tools and suggestions."
        ></Trans>
      ),
    },
    {
      icon: <KeyIcon size={24} />,
      title: <Trans id="Privacy-First"></Trans>,
      description: (
        <Trans
          id="Tailored for individual creators to express themselves freely."
          message="Tailored for individual creators to express themselves freely."
        ></Trans>
      ),
    },
    {
      icon: <GithubIcon size={24} />,
      title: <Trans id="Open Source"></Trans>,
      description: (
        <Trans
          id="Easily create and send newsletters to keep your audience engaged."
          message=""
        ></Trans>
      ),
    },
    {
      icon: <TabletSmartphoneIcon size={24} />,
      title: <Trans id="Cross platform"></Trans>,
      description: (
        <Trans
          id="Offer exclusive content and benefits to loyal members."
          message="Offer exclusive content and benefits to loyal members."
        ></Trans>
      ),
    },
    {
      icon: <RefreshCcwIcon size={24} />,
      title: <Trans id="Realtime sync"></Trans>,
      description: (
        <Trans
          id="Optimize your content for search engines with ease."
          message="Optimize your content for search engines with ease."
        ></Trans>
      ),
    },
    {
      icon: <PencilIcon size={24} />,
      title: <Trans id="Creator friendly"></Trans>,
      description: (
        <Trans
          id="Enjoy a seamless writing experience with our intuitive editor."
          message="Enjoy a seamless writing experience with our intuitive editor."
        ></Trans>
      ),
    },
  ]

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl space-y-10">
      {/* <div className="space-y-4 text-center">
        <div className="text-5xl font-bold">
          <Trans id="Features" message="Features"></Trans>
        </div>
        <div className="text-foreground/60 text-xl">
          <Trans
            id="Powerful features to build to digital garden"
            message="Powerful features to build to digital garden"
          ></Trans>
        </div>
      </div> */}
      <div className="bg-transparent">
        <div className="border-foreground/10 grid grid-cols-1 overflow-hidden border-l border-t sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'border-foreground/10 bg-background/5 group space-y-2 border-b border-r p-8 transition-all',
              )}
            >
              {feature.icon ?? <RocketIcon size={24} />}
              <div className="text-lg font-semibold transition-all group-hover:scale-105">
                {feature.title}
              </div>
              {/* <div className="text-foreground/50 text-base  transition-all group-hover:scale-105">
                {feature.description}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
