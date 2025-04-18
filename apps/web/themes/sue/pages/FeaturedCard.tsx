'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Link } from '@/lib/i18n'
import { Creation, Site, Tag } from '@/lib/theme.types'
import { formatDate } from '@/lib/utils'
import { Node } from 'slate'
import { PostItem } from '../components/PostItem'

interface Props {
  creations: Creation[]
}

export function FeaturedCard({ creations = [] }: Props) {
  if (!creations.length) return null

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-foreground text-xl font-medium leading-none tracking-tight sm:text-xl">
          Featured
        </h1>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="w-full">
          {creations.map((post, index) => (
            <CarouselItem key={index} className="basis-5/6">
              <Card className="w-full">
                <CardHeader className="">
                  <CardTitle className="text-base">
                    <Link href={`/creations/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(post.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="-mt-3">
                  <Link
                    href={`/creations/${post.slug}`}
                    className="text-foreground/60 line-clamp-2"
                  >
                    {getPostText(post.content!).slice(0, 300)}
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}

          <CarouselPrevious />
          <CarouselNext />
        </CarouselContent>
      </Carousel>
    </div>
  )
}

function getTextFromChildren(children: any[]) {
  return children.reduce((acc: string, child: any) => {
    return acc + Node.string(child)
  }, '')
}

function getPostText(content: any) {
  const text = JSON.parse(content)
    .map((element: any) => {
      if (Array.isArray(element.children)) {
        return getTextFromChildren(element.children)
      } else {
        return Node.string(element)
      }
    })
    .join('')
  return text
}
