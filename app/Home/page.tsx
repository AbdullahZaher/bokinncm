'use client'

import { FC } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Hotel, Bed, ChevronRight, ChevronLeft } from 'lucide-react';
import HomeLayout from "./HomeLayout";

interface PageProps {
  locale: {
    dir: 'rtl' | 'ltr';
  };
  app: {
    demo_url: string;
  };
}

const HomePage: FC<PageProps> = ({ locale, app }) => {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <main className="py-8 flex flex-col bg-[hsl(var(--home-bg))]">
        <div className="max-w-4xl mx-auto px-5 order-2 md:order-1">
          <div className="text-center py-4 lg:py-8">
            <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--foreground))]">
              Bokinn.. a modern easy platform
            </div>

            <div className="text-lg lg:text-xl  mt-4 text-[hsl(var(--foreground))]">
              Create your platform and manage your property...
            </div>

            <div className="mt-8 flex items-center gap-3 justify-center text-lg flex-col md:flex-row">
              <Link
                href="/register"
                className="text-white bg-[hsl(var(--foreground))] px-10 py-2 rounded-lg w-full md:w-auto"
              >
                Join us for free
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[90rem] mx-auto md:transform md:translate-y-60 md:block order-1 md:order-2 mb-10 md:mb-0">
          <Image 
            src="/imgs/central-hero.png" 
            alt="Hero"
            width={1440}
            height={810}
            className="w-full md:-mt-48"
          />
        </div>
      </main>


       {/* Stats Section */}
      <section className="md:mt-64">
        <div className="max-w-screen-xl mx-auto px-5 py-16">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-2xl lg:text-4xl font-bold text-center">
              Bokinn.. the newest option...
            </div>
            <div className="text-lg lg:text-xl font-normal text-center">
              Create your online platform...
            </div>
          </div>

          <div className="flex items-center justify-center flex-col md:flex-row gap-14 md:gap-24 mt-16">
            <div className="flex items-start gap-3">
              <div className="border-2 border-[hsl(var(--home-bg))] p-2 flex items-center justify-center text-3xl font-bold rounded-xl h-16 w-16">
                <Hotel className="text-[hsl(var(--home-bg))]" />
              </div>
              <div className="space-y-2">
                <div className="font-bold text-4xl text-[hsl(var(--home-bg))]">+4,678</div>
                <div className="font-bold text-sm text-gray-500">
                  hotels and apartments...
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="border-2 border-[hsl(var(--home-bg))] p-2 flex items-center justify-center text-3xl font-bold rounded-xl h-16 w-16">
                <Bed className="text-[hsl(var(--home-bg))]" />
              </div>
              <div className="space-y-2">
                <div className="font-bold text-4xl text-[hsl(var(--home-bg))]">+1,100,000</div>
                <div className="font-bold text-sm text-gray-500">
                  hotel room and furnished apartments
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Services Section */}
      <section className="mt-10 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-5 py-16">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-xl lg:text-2xl font-normal text-center text-[hsl(var(--foreground))]">
              Whatever the field of your real estate...
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 lg:mt-16 gap-6">
            {[
              {
                title: "Hotels",
                description: "Easy solutions that help hotels improve their performance and increase their revenue"
              },
              {
                title: "Furnished Apartments",
                description: "Solutions to use the platform to manage other services like laundry and buffet"
              },
              {
                title: "Chalets",
                description: "Easy to use and not complicated with a nice interface"
              },
              {
                title: "Rest Rooms",
                description: "All you need to manage your apartments digitally"
              },
              {
                title: "Studios",
                description: "Helps partners to attract more guests"
              },
              {
                title: "Villas",
                description: "Link your apartments to online booking websites"
              },
              {
                title: "Compounds",
                description: "Escalate working efficiency by simplifying the tasks and time saving"
              },
              {
                title: "Huts",
                description: "The perfect place to track your business with precision and view detailed statistics"
              },
              {
                title: "Portable Houses",
                description: "Many features that suits all your different apartments"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white py-5 px-4 rounded-sm shadow-lg hover:bg-gray-100/80 transition-colors"
              >
                <div className="border-2 border-[hsl(var(--home-bg))] p-2 flex items-center justify-center text-2xl font-bold rounded-xl h-12 w-14">
                  <Hotel className="text-[hsl(var(--home-bg))]" />
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-xl lg:text-2xl text-[hsl(var(--home-bg))]">
                    {service.title}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {service.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features Section */}
      <section className="mt-10">
        <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="col-span-2 space-y-8 order-2 lg:order-1">
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
                Simple not complicated system
              </div>
              <p className="text-lg  text-gray-500">
                Easy to use...
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                "Two different interfaces: grid and list that makes work more fun and easy",
                "You can save your favorite customization according to your needs",
                "Allows you to manage your work aspects without the need for technical experience or any previous training"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-500">
                  {locale.dir === 'rtl' ? 
                    <ChevronLeft className="mt-1 text-[hsl(var(--home-bg))]" size={20} /> : 
                    <ChevronRight className="mt-1 text-[hsl(var(--home-bg))]" size={20} />
                  }
                  <span className="">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 order-1 lg:order-2">
            <Image 
              src="/imgs/img1.png" 
              alt="System Features"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section className="mt-10 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="col-span-2 space-y-8 order-2">
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
                Management with peace of mind
              </div>
              <p className="text-lg text-gray-500 ">
                Fully integrated platform from your location to all world's countries with ease
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                "Supports more that display language to suit every team member of yours",
                "Receive reservations from any place in the world",
                "Control the processes of your apartment and selling channels smoothly",
                "Management of reservations, employees, and orders with the ability to track your business remotely"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {locale.dir === 'rtl' ? 
                    <ChevronLeft className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} /> : 
                    <ChevronRight className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} />
                  }
                  <span className="text-base text-gray-500">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 order-1">
            <Image 
              src="/imgs/img2.png" 
              alt="Management Features"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>


{/* Payment Section */}
<section className="mt-10">
  <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
    <div className="col-span-2 space-y-8 order-2 lg:order-1">
      <div className="space-y-3">
        <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
          Diverses secure payment solutions with one enable
        </div>
        <p className="text-lg  text-gray-500">
          Benefit from the integrated digital payments solutions to manage your payments of your properties and guests
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {[
          "You can enable digital payment with one click",
          "Diverse payment solutions: Mada, Visa, Mastercard and Apple Pay",
          "Without any setup fees or monthly fees",
          "High protection and secure for all your transactions"
        ].map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {locale.dir === 'rtl' ? 
              <ChevronLeft className="mt-1 text-[hsl(var(--home-bg))]" size={20} /> : 
              <ChevronRight className="mt-1 text-[hsl(var(--home-bg))]" size={20} />
            }
            <span className=" text-gray-500">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="col-span-3 order-1 lg:order-2">
      <Image 
        src="/imgs/img3.png" 
        alt="Payment Solutions"
        width={800}
        height={600}
      />
    </div>
  </div>
</section>

{/* Employee Section */}
<section className="mt-10 bg-gray-100">
  <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
    <div className="col-span-2 space-y-8 order-2">
      <div className="space-y-3">
        <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
          Make your employees happy with the easy way to sign in
        </div>
        <p className="text-lg text-gray-500 ">
          All you have to do is to click on add reservation icon from room square
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {[
          "You don't have to ask guest to fill all his data",
          "Contracts that has the ability to be customized according to rental way",
          "Track payments methods for guests and make use of the statistics",
          "Separate page to view all current and previous reservations with all of the details"
        ].map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {locale.dir === 'rtl' ? 
              <ChevronLeft className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} /> : 
              <ChevronRight className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} />
            }
            <span className="text-base text-gray-500">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="col-span-3 order-1">
      <Image 
        src="/imgs/img4.png" 
        alt="Employee Features"
        width={800}
        height={600}
      />
    </div>
  </div>
</section>

{/* Marketing Section */}
<section className="mt-10">
  <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
    <div className="col-span-2 space-y-8 order-2 lg:order-1">
      <div className="space-y-3">
        <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
          Market your property everywhere
        </div>
        <p className="text-lg  text-gray-500">
          Target more guests using different marketing solutions
        </p>
      </div>

      <div className="flex flex-col gap-4 text-gray-500">
        {[
          "Provide tailored offers to your properties' guests to persuade them to finish and redo their visit",
          "Control every detail for your offers and discounts",
          "Support for commision marketing for your property",
          "Get to know your property performance using detailed statistics dashboard",
          "Track your marketing campaigns on different platforms"
        ].map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {locale.dir === 'rtl' ? 
              <ChevronLeft className="mt-1 text-[hsl(var(--home-bg))]" size={20} /> : 
              <ChevronRight className="mt-1 text-[hsl(var(--home-bg))]" size={20} />
            }
            <span className="">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="col-span-3 order-1 lg:order-2">
      <Image 
        src="/imgs/img5.png" 
        alt="Marketing Features"
        width={800}
        height={600}
      />
    </div>
  </div>
</section>


      {/* Guest Orders Section */}
      <section className="mt-10 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="col-span-2 space-y-8 order-2">
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
                Guests' Orders
              </div>
              <p className="text-lg text-gray-500 ">
                Upgrade your room service to another level
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                "Offer your accompanying services to guests in the rooms with a special link",
                "Diverse services for all types of products",
                "Connect your units to other facilities and track orders directly"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {locale.dir === 'rtl' ? 
                    <ChevronLeft className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} /> : 
                    <ChevronRight className="text-[hsl(var(--home-bg))] text-base mt-1" size={20} />
                  }
                  <span className="text-base text-gray-500">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 order-1">
            <Image 
              src="/imgs/img6.png" 
              alt="Guest Orders Features"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Extra Properties Section */}
      <section className="mt-10">
        <div className="max-w-screen-xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="col-span-2 space-y-8 order-2 lg:order-1">
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-[hsl(var(--home-bg))]">
                Extra Properties
              </div>
              <p className="text-lg  text-gray-500">
                Your guests' satisfaction needs tracking your properties and monitoring its services from near
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                "Support for transfering rooms to maintenance mode",
                "Ability to add notes for each property and guest",
                "Link your calendar with booking applications",
                "Digital tools that helps you in different fields like whatsapp messages and electronic invoices"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {locale.dir === 'rtl' ? 
                    <ChevronLeft className="mt-1 text-[hsl(var(--home-bg))]" size={20} /> : 
                    <ChevronRight className="mt-1 text-[hsl(var(--home-bg))]" size={20} />
                  }
                  <span className=" text-gray-500">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 order-1 lg:order-2">
            <Image 
              src="/imgs/img7.png" 
              alt="Extra Properties Features"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mt-10 px-5">
        <div className="max-w-screen-xl mx-auto p-10 flex justify-between items-center flex-col lg:flex-row gap-6 lg:gap-10 bg-[hsl(var(--home-bg))] rounded-2xl">
          <div className="space-y-3 text-left ltr:lg:text-left rtl:lg:text-right">
            <div className="text-2xl lg:text-4xl font-bold">
              Start your modern platform now
            </div>
            <p className="text-base lg:text-lg text-gray-500">
              We provide you with totally integrated services to manage your property: link to booking application, 
              enable digital payment gateways, connect with calendar to complete task from dashboard. 
              Bokinn is the best solution for your property.
            </p>
          </div>

          <Link
            href="/register"
            className="text-white bg-[hsl(var(--foreground))] hover:bg-primary/90 px-10 py-2 rounded-lg  text-lg whitespace-nowrap w-full lg:w-auto text-center"
          >
            Join us for free
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
};

export default HomePage;
