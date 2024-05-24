import Image from 'next/image';
import { Inter } from 'next/font/google';
import JoinCommunity from '@/components/JoinCommunity';
import ComingSoon from '@/components/ComingSoon';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
      <div className="bg-background text-text min-h-screen">
        <div className="hero min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }}>
          <div className="hero-overlay bg-gray-500 bg-opacity-70"></div>
          <div className="hero-content text-center text-neutral-content flex items-center justify-center">
            <div className="max-w-2xl px-4 py-8">
              <h1 className="mb-5 text-2xl text-white sm:text-5xl font-bold">Fresh Garden Produce from Your Neighbors!</h1>
              <p className="mb-5 text-lg text-white sm:text-xl">
                Buy and sell fresh, locally-grown produce directly from gardeners in your community.
              </p>
              <button className="btn btn-accent text-md sm:text-lg px-6 py-3">Get Started</button>
            </div>
          </div>
        </div>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <div className="flex flex-wrap justify-center mt-8 space-x-4">
            <div className="card w-64 bg-white shadow-lg">
              <figure className="px-10 pt-10">
                <i className="fas fa-leaf fa-5x text-primary"></i>
              </figure>
              <div className="card-body">
                <h3 className="card-title">Fresh &amp; Local</h3>
                <p>Enjoy fresh produce grown by your neighbors.</p>
              </div>
            </div>
            <div className="card w-64 bg-white shadow-lg">
              <figure className="px-10 pt-10">
                <i className="fas fa-hand-holding-heart fa-5x text-primary"></i>
              </figure>
              <div className="card-body">
                <h3 className="card-title">Support Your Community</h3>
                <p>Help local gardeners by buying directly from them.</p>
              </div>
            </div>
            <div className="card w-64 bg-white shadow-lg">
              <figure className="px-10 pt-10">
                <i className="fas fa-mobile-alt fa-5x text-primary"></i>
              </figure>
              <div className="card-body">
                <h3 className="card-title">Easy to Use</h3>
                <p>Simple platform for buying and selling garden products.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 text-center bg-neutral">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="flex flex-wrap justify-center mt-8 space-x-8">
            <div className="w-64 flex flex-col items-center">
              <i className="fas fa-user-plus fa-5x text-primary mb-4"></i>
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p>Create your account and start exploring.</p>
            </div>
            <div className="w-64 flex flex-col items-center">
              <i className="fas fa-list fa-5x text-primary mb-4"></i>
              <h3 className="text-xl font-bold">List Your Products</h3>
              <p>Share your fresh produce with the community.</p>
            </div>
            <div className="w-64 flex flex-col items-center">
              <i className="fas fa-handshake fa-5x text-primary mb-4"></i>
              <h3 className="text-xl font-bold">Connect with Buyers</h3>
              <p>Engage with local buyers and grow your garden&apos;s reach.</p>
            </div>
          </div>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <ComingSoon />
          {/* Uncomment and use Next.js Image component for featured products
        <div className="flex flex-wrap justify-center mt-8 space-x-4">
          <div className="card w-64 bg-white shadow-lg">
            <figure className="px-10 pt-10">
              <Image src="/images/product1.jpg" alt="Tomatoes" width={200} height={200} className="rounded-xl" />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Tomatoes</h3>
              <p>Freshly picked organic tomatoes.</p>
            </div>
          </div>
          <div className="card w-64 bg-white shadow-lg">
            <figure className="px-10 pt-10">
              <Image src="/hero.png" alt="Carrots" width={200} height={200} className="rounded-xl" />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Carrots</h3>
              <p>Sweet and crunchy carrots.</p>
            </div>
          </div>
        </div>
        */}
        </section>

        <JoinCommunity />
      </div>
  );
}
