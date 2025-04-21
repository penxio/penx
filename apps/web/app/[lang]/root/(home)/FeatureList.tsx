import { Trans } from '@lingui/react'
import {
  BotIcon,
  BugIcon,
  MailIcon,
  MessageCircleMore,
  PaletteIcon,
  PencilIcon,
  RocketIcon,
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
      icon: <BotIcon size={24} />,
      title: <Trans id="AI-assistants" message="AI-assistants"></Trans>,
      description: (
        <Trans
          id="Enhance your content creation with AI-powered tools and suggestions."
          message="Enhance your content creation with AI-powered tools and suggestions."
        ></Trans>
      ),
    },
    {
      icon: <UserIcon size={24} />,
      title: (
        <Trans
          id="Build for super individual"
          message="Build for super individual"
        ></Trans>
      ),
      description: (
        <Trans
          id="Tailored for individual creators to express themselves freely."
          message="Tailored for individual creators to express themselves freely."
        ></Trans>
      ),
    },
    {
      icon: <MailIcon size={24} />,
      title: (
        <Trans id="Newsletters built-in" message="Newsletters built-in"></Trans>
      ),
      description: (
        <Trans
          id="Easily create and send newsletters to keep your audience engaged."
          message=""
        ></Trans>
      ),
    },
    {
      icon: <ZapIcon size={24} />,
      title: (
        <Trans id="Memberships built-in" message="Memberships built-in"></Trans>
      ),
      description: (
        <Trans
          id="Offer exclusive content and benefits to loyal members."
          message="Offer exclusive content and benefits to loyal members."
        ></Trans>
      ),
    },
    {
      icon: <BugIcon size={24} />,
      title: <Trans id="SEO friendly" message="SEO friendly"></Trans>,
      description: (
        <Trans
          id="Optimize your content for search engines with ease."
          message="Optimize your content for search engines with ease."
        ></Trans>
      ),
    },
    {
      icon: <PencilIcon size={24} />,
      title: <Trans id="Modern editor" message="Modern editor"></Trans>,
      description: (
        <Trans
          id="Enjoy a seamless writing experience with our intuitive editor."
          message="Enjoy a seamless writing experience with our intuitive editor."
        ></Trans>
      ),
    },
    {
      title: <Trans id="Data ownership" message="Data ownership"></Trans>,
      description: (
        <Trans
          id="Maintain full control over your content and data."
          message="Maintain full control over your content and data."
        ></Trans>
      ),
    },
    {
      icon: <MessageCircleMore size={24} />,
      title: <Trans id="Comments built-in" message="Comments built-in"></Trans>,
      description: (
        <Trans
          id="Engage with your audience through integrated comment features."
          message="Engage with your audience through integrated comment features."
        ></Trans>
      ),
    },
    {
      icon: <PaletteIcon size={24} />,
      title: <Trans id="Beautiful themes" message="Beautiful themes"></Trans>,
      description: (
        <Trans
          id="Customize your site with a variety of visually appealing themes."
          message="Customize your site with a variety of visually appealing themes."
        ></Trans>
      ),
    },
  ]

  return (
    <div className="mt-10 space-y-10">
      <div className="space-y-4 text-center">
        <div className="text-5xl font-bold">
          <Trans id="Features" message="Features"></Trans>
        </div>
        <div className="text-foreground/60 text-xl">
          <Trans
            id="Powerful features to build to digital garden"
            message="Powerful features to build to digital garden"
          ></Trans>
        </div>
      </div>
      <div className="bg-transparent">
        <div className="border-foreground/10 grid grid-cols-1 overflow-hidden border-l border-t sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'border-foreground/10 bg-background/30 group space-y-2 border-b border-r p-8 transition-all',
              )}
            >
              {feature.icon ?? <RocketIcon size={24} />}
              <div className="text-lg font-bold transition-all group-hover:scale-105">
                {feature.title}
              </div>
              <div className="text-foreground/50 text-base  transition-all group-hover:scale-105">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
