const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');
const Requirement = require('../models/Requirement');
const Application = require('../models/Application');
const Deal = require('../models/Deal');
const Review = require('../models/Review');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Adloom Seeder] Connected to database for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await CreatorProfile.deleteMany();
    await Requirement.deleteMany();
    await Application.deleteMany();
    await Deal.deleteMany();
    await Review.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();

    console.log('[Adloom Seeder] Purged old collections.');

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'Adloom Administrator',
      email: 'admin@adloom.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Adloom Executive Platform Administrator',
      isVerified: true,
    });

    // 2. Create Business Users
    const biz1 = await User.create({
      name: 'Apex Audio Gear',
      email: 'business@adloom.com',
      password: 'password123',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=300&q=80',
      companyName: 'Apex Audio Technologies',
      companyWebsite: 'https://apexaudio.example.com',
      bio: 'Premium studio audio, wireless ANC headphones and podcast microphones.',
      location: { city: 'San Francisco', country: 'United States' },
      isVerified: true,
    });

    const biz2 = await User.create({
      name: 'Verde Glow Organics',
      email: 'verdeglow@business.com',
      password: 'password123',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80',
      companyName: 'Verde Glow Cosmetics',
      companyWebsite: 'https://verdeglow.example.com',
      bio: 'Clean, botanical, cruelty-free skincare formulated for glowing skin.',
      location: { city: 'London', country: 'United Kingdom' },
      isVerified: true,
    });

    const biz3 = await User.create({
      name: 'NovaFit Nutrition',
      email: 'novafit@business.com',
      password: 'password123',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80',
      companyName: 'NovaFit Athletics',
      companyWebsite: 'https://novafit.example.com',
      bio: 'Next-gen organic plant protein, pre-workouts and hydration electrolytes.',
      location: { city: 'Austin', country: 'United States' },
      isVerified: true,
    });

    // 3. Create Creator Users & Profiles
    const creator1 = await User.create({
      name: 'Alex Vance',
      email: 'creator@adloom.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      bio: 'Tech YouTuber & AI Reviewer breaking down gadgets, smartphones, developer workflows & smart home gear.',
      location: { city: 'San Francisco', country: 'United States' },
      isVerified: true,
    });

    await CreatorProfile.create({
      user: creator1._id,
      tagline: 'Tech YouTuber, Gadget Reviewer & AI Workflow Creator',
      bio: 'Hey there! I create cinematic tech deep-dives, honest reviews, and aesthetic setup reels. Reaching over 380,000 active tech enthusiasts, engineers, and digital nomads across YouTube, Instagram, and TikTok.',
      categories: ['Tech & AI', 'Photography & Video'],
      languages: ['English', 'Spanish'],
      location: { city: 'San Francisco', country: 'United States' },
      socialMedia: [
        { platform: 'YouTube', handle: '@AlexVanceTech', followersCount: 240000, profileUrl: 'https://youtube.com', engagementRate: 6.4 },
        { platform: 'Instagram', handle: '@alex.vance', followersCount: 110000, profileUrl: 'https://instagram.com', engagementRate: 4.8 },
        { platform: 'Twitter', handle: '@alexvance', followersCount: 35000, profileUrl: 'https://twitter.com', engagementRate: 3.2 },
      ],
      packages: {
        basic: {
          title: 'Quick Social Spotlight',
          description: '1 Dedicated Instagram Story Sequence (3 frames) + Link in Bio for 48h + Product Tag',
          price: 150,
          deliveryDays: 2,
          revisions: 1,
          deliverables: ['3 IG Story Frames', 'Clickable Affiliate Link', 'Product Tagging', 'High-Res Frame Stills'],
        },
        standard: {
          title: 'Cinematic Reel / TikTok Showcase',
          description: '1 60s 4K Reel / TikTok featuring high-energy unboxing, B-roll showcase, and voiceover review.',
          price: 380,
          deliveryDays: 4,
          revisions: 2,
          deliverables: ['1 4K Dedicated Vertical Video', 'Cross-posted to IG & TikTok', 'Soundtrack Licensing Included', '3 High-Res Thumbnail Options'],
        },
        premium: {
          title: 'Complete YouTube Integration & UGC Bundle',
          description: '60-90s dedicated mid-roll integration in a YouTube deep-dive + Short + Full Commercial Usage Rights for 90 days.',
          price: 850,
          deliveryDays: 7,
          revisions: 3,
          deliverables: ['90s Integrated YouTube Sponsor Segment', '1 YouTube Short / Reel', '90 Days Ad Usage License', 'Pinned Comment with Promo Code'],
        },
      },
      portfolio: [
        {
          title: 'Sony Alpha FX3 Review & Cinematic Sample Shots',
          description: 'High production camera test with 120k+ impressions',
          mediaUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Sony Creator Club',
          viewsCount: 142000,
        },
        {
          title: 'Minimalist Desk Setup & Studio Tour 2026',
          description: 'Sponsored by Grovemade and BenQ',
          mediaUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Grovemade',
          viewsCount: 210000,
        },
        {
          title: 'Wireless Earbuds Noise Cancellation Test in Metro',
          description: 'B-roll heavy real world audio trial',
          mediaUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Apex Audio',
          viewsCount: 88000,
        },
      ],
      startingPrice: 150,
      ratingAverage: 4.9,
      reviewCount: 18,
      completedDealsCount: 24,
      isFeatured: true,
      badges: ['Top Rated Pro', 'Fast Responder', 'Verified Tech Partner'],
    });

    const creator2 = await User.create({
      name: 'Maya Chen',
      email: 'maya@creators.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      bio: 'Culinary explorer, food stylist, and restaurant spotlight vlogger based in New York & Paris.',
      location: { city: 'New York', country: 'United States' },
      isVerified: true,
    });

    await CreatorProfile.create({
      user: creator2._id,
      tagline: 'Food Vlogger, Recipe Developer & Aesthetic Dining Critic',
      bio: 'Sharing mouthwatering restaurant discoveries, artisanal kitchenware demos, and viral cooking recipes. Reaching 520,000 enthusiastic foodies worldwide.',
      categories: ['Food & Cooking', 'Travel & Lifestyle'],
      languages: ['English', 'French', 'Mandarin'],
      location: { city: 'New York', country: 'United States' },
      socialMedia: [
        { platform: 'Instagram', handle: '@maya.eats', followersCount: 310000, profileUrl: 'https://instagram.com', engagementRate: 7.2 },
        { platform: 'TikTok', handle: '@mayachenfood', followersCount: 185000, profileUrl: 'https://tiktok.com', engagementRate: 9.1 },
        { platform: 'YouTube', handle: '@MayaChenCulinary', followersCount: 65000, profileUrl: 'https://youtube.com', engagementRate: 5.5 },
      ],
      packages: {
        basic: {
          title: 'Restaurant / Snack Story Shoutout',
          description: 'Aesthetic multi-slide foodie story highlighting taste profile, location & ordering perks.',
          price: 120,
          deliveryDays: 2,
          revisions: 1,
          deliverables: ['3 High-Res Story Cards', 'Tagged Location & Geo-filter', 'Swipe Up/Link to Menu'],
        },
        standard: {
          title: 'Viral Taste Test & Recipe Reel',
          description: 'High-energy recipe integration or dining vlog video with ASMR audio and macro food cinematography.',
          price: 320,
          deliveryDays: 3,
          revisions: 2,
          deliverables: ['1 Viral Quality Recipe Video', 'Custom Audio / ASMR Mix', 'Edited for TikTok & Reels', '5 High-Res Food Photographs'],
        },
        premium: {
          title: 'Full In-Person Restaurant Showcase & Brand Deal',
          description: 'On-location shoot, multi-dish tasting reel, story campaign, and permanent feature in curated guides.',
          price: 650,
          deliveryDays: 5,
          revisions: 2,
          deliverables: ['On-site Dining Reel (60s)', '5 IG Stories on Visit Day', 'Permanent Guide Inclusion', 'Full Photo Suite for Brand Socials'],
        },
      },
      portfolio: [
        {
          title: 'Artisanal Sourdough Pizza Crafting & Review',
          description: 'Over 450,000 views on Instagram Reels',
          mediaUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Rustica NYC',
          viewsCount: 450000,
        },
        {
          title: 'Japanese Cast Iron Skillet Cooking Series',
          description: '3-part cookware product demonstration',
          mediaUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Kurogane Cookware',
          viewsCount: 180000,
        },
      ],
      startingPrice: 120,
      ratingAverage: 5.0,
      reviewCount: 32,
      completedDealsCount: 38,
      isFeatured: true,
      badges: ['Top Rated Pro', 'Culinary Ambassador', 'Verified Creator'],
    });

    const creator3 = await User.create({
      name: 'Sofia Althaus',
      email: 'sofia@creators.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      bio: 'Fashion stylist, sustainable apparel advocate & aesthetic daily lookbook creator.',
      location: { city: 'Berlin', country: 'Germany' },
      isVerified: true,
    });

    await CreatorProfile.create({
      user: creator3._id,
      tagline: 'Fashion Stylist, Lookbook Curator & Sustainable Apparel Influencer',
      bio: 'Curating modern minimalist streetwear, luxury vintage styling, and eco-conscious apparel looks. Based between Berlin and Milan.',
      categories: ['Fashion & Apparel', 'Beauty & Skincare'],
      languages: ['English', 'German', 'Italian'],
      location: { city: 'Berlin', country: 'Germany' },
      socialMedia: [
        { platform: 'Instagram', handle: '@sofia.althaus', followersCount: 220000, profileUrl: 'https://instagram.com', engagementRate: 5.8 },
        { platform: 'TikTok', handle: '@sofiafashion', followersCount: 190000, profileUrl: 'https://tiktok.com', engagementRate: 8.4 },
        { platform: 'Pinterest', handle: '@sofiaalthaus', followersCount: 75000, profileUrl: 'https://pinterest.com', engagementRate: 4.1 },
      ],
      packages: {
        basic: {
          title: 'Outfit of the Day Lookbook Post',
          description: 'Single carousel post featuring 3-4 styled looks with product tagging and discount code caption.',
          price: 180,
          deliveryDays: 3,
          revisions: 1,
          deliverables: ['1 Instagram Feed Carousel', '2 Supporting Story Slides', 'Direct Tag in Lookbook'],
        },
        standard: {
          title: 'Transition Reel & Try-On Haul',
          description: 'Dynamic synchronized outfit transition video with trending sound and close-up fabric detailing.',
          price: 420,
          deliveryDays: 4,
          revisions: 2,
          deliverables: ['1 High-Quality Transition Reel', 'Posted on TikTok & Instagram', '6 High-Res Lookbook Photos', 'Link in Bio (14 days)'],
        },
        premium: {
          title: 'Seasonal Brand Capsule Campaign',
          description: '3 dedicated Reels + 2 Feed Carousels + Full digital advertising usage rights for 60 days.',
          price: 950,
          deliveryDays: 8,
          revisions: 3,
          deliverables: ['3 Styled Reels', '2 Instagram Posts', '60 Days Ad Whitelisting', 'Raw 4K Footage Package'],
        },
      },
      portfolio: [
        {
          title: 'Autumn Trench Coat & Wool Knit Lookbook',
          description: 'Minimalist editorial photoshoot in Berlin Mitte',
          mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Aurelia Studio',
          viewsCount: 310000,
        },
        {
          title: 'Clean Beauty & Morning Glow Skincare Ritual',
          description: 'Step-by-step skincare routine featuring natural botanical serums',
          mediaUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'Verde Glow Cosmetics',
          viewsCount: 195000,
        },
      ],
      startingPrice: 180,
      ratingAverage: 4.9,
      reviewCount: 22,
      completedDealsCount: 29,
      isFeatured: true,
      badges: ['Top Rated Pro', 'Editorial Partner'],
    });

    const creator4 = await User.create({
      name: 'Marcus Brody',
      email: 'marcus@creators.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Certified Strength Coach, HYROX athlete, and high-performance nutrition coach.',
      location: { city: 'Austin', country: 'United States' },
      isVerified: true,
    });

    await CreatorProfile.create({
      user: creator4._id,
      tagline: 'Certified Strength Coach, HYROX Athlete & High-Performance Creator',
      bio: 'Empowering over 290,000 athletes, gym-goers, and fitness enthusiasts with science-backed training protocols and supplement breakdowns.',
      categories: ['Fitness & Health'],
      languages: ['English'],
      location: { city: 'Austin', country: 'United States' },
      socialMedia: [
        { platform: 'Instagram', handle: '@marcus.brody.fit', followersCount: 195000, profileUrl: 'https://instagram.com', engagementRate: 6.9 },
        { platform: 'YouTube', handle: '@MarcusBrodyFitness', followersCount: 95000, profileUrl: 'https://youtube.com', engagementRate: 7.5 },
      ],
      packages: {
        basic: {
          title: 'Gym Workout Story Feature',
          description: 'Pre-workout / intra-workout drink showcase during heavy lift session.',
          price: 110,
          deliveryDays: 2,
          revisions: 1,
          deliverables: ['2 Workout Stories', 'Product Tagging & Promo Code'],
        },
        standard: {
          title: 'Full Workout Video + Supplement Integration',
          description: '60s workout split reel with dedicated 15s demonstration of formula benefits.',
          price: 290,
          deliveryDays: 4,
          revisions: 2,
          deliverables: ['1 High-Energy Training Reel', 'YouTube Community Post', 'Promo Code in Bio'],
        },
        premium: {
          title: '30-Day Training Challenge Sponsor',
          description: 'Title sponsor of monthly community challenge + 4 dedicated posts + story series.',
          price: 750,
          deliveryDays: 10,
          revisions: 2,
          deliverables: ['4 Video Reels', 'Weekly Story Updates', 'Email Newsletter Spotlight (15k list)'],
        },
      },
      portfolio: [
        {
          title: 'Explosive Deadlift Mechanics & Recovery Protocol',
          description: 'Sponsored athletic training breakdown',
          mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
          mediaType: 'image',
          clientName: 'NovaFit Athletics',
          viewsCount: 220000,
        },
      ],
      startingPrice: 110,
      ratingAverage: 4.8,
      reviewCount: 15,
      completedDealsCount: 21,
      isFeatured: true,
      badges: ['Verified Athlete', 'Top Fitness Pro'],
    });

    // 4. Create Business Requirements / Promotion Campaigns
    const req1 = await Requirement.create({
      business: biz1._id,
      title: 'Apex Sonic Pro Wireless ANC Headphones Launch Campaign',
      description: 'We are launching our next-gen wireless noise-cancelling headphones featuring 45h battery life and audiophile spatial drivers. Looking for tech creators, audio reviewers, and lifestyle creators to produce high-impact unboxings, sound test reels, and commuter reviews.',
      category: 'Tech & AI',
      platforms: ['YouTube', 'Instagram', 'TikTok'],
      budget: { min: 300, max: 800, currency: 'USD' },
      locationTarget: 'United States, UK, Canada',
      minFollowersRequired: 25000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      deliverables: [
        '1 Dedicated 60s 4K Reel or TikTok video demonstrating active noise cancellation in public setting',
        '3 Instagram Story frames with swipe-up pre-order discount code',
        'High-resolution lifestyle photos with the headphones on',
      ],
      status: 'open',
      applicantsCount: 3,
      viewsCount: 142,
    });

    const req2 = await Requirement.create({
      business: biz2._id,
      title: 'Spring Radiant Botanical Serum & Clean Glow Campaign',
      description: 'Verde Glow is seeking beauty and wellness influencers for our Spring Launch. We need honest morning routine videos, ingredient spotlights (Niacinamide + Rosehip), and before/after texture demonstrations.',
      category: 'Beauty & Skincare',
      platforms: ['Instagram', 'TikTok'],
      budget: { min: 200, max: 500, currency: 'USD' },
      locationTarget: 'Global / Any',
      minFollowersRequired: 15000,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      deliverables: [
        '1 Morning Glow Skincare Routine Video (Reel/TikTok)',
        'Close up B-roll of serum dropper and absorption',
        '2 Instagram Story posts with promo code',
      ],
      status: 'open',
      applicantsCount: 2,
      viewsCount: 98,
    });

    const req3 = await Requirement.create({
      business: biz3._id,
      title: 'NovaFit Organic Plant Protein & Pre-Workout Ambassador Search',
      description: 'Looking for 3-5 passionate fitness coaches, athletes, and gym creators to integrate NovaFit organic recovery blend into their daily post-workout nutrition routine.',
      category: 'Fitness & Health',
      platforms: ['Instagram', 'YouTube'],
      budget: { min: 250, max: 700, currency: 'USD' },
      locationTarget: 'United States',
      minFollowersRequired: 10000,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      deliverables: [
        '1 High-energy post-workout shake recipe video',
        'Review of taste, miscibility, and clean digestion',
        'Bio link promo code promotion for 14 days',
      ],
      status: 'open',
      applicantsCount: 1,
      viewsCount: 75,
    });

    // 5. Create Applications
    await Application.create({
      requirement: req1._id,
      creator: creator1._id,
      pitch: 'Hey Apex Team! I have tested several premium ANC headphones (Sony, Bose, AirPods Max) on my channel. I would love to conduct a subway noise reduction challenge and cinematic macro b-roll review for my 380k tech audience.',
      proposedPrice: 480,
      estimatedDeliveryDays: 4,
      portfolioLinks: ['https://instagram.com/alex.vance', 'https://youtube.com/@AlexVanceTech'],
      status: 'accepted',
    });

    await Application.create({
      requirement: req2._id,
      creator: creator3._id,
      pitch: 'Hi Verde Glow! My audience loves organic and eco-friendly skincare rituals. I can produce an aesthetic morning skincare routine reel matching your brand lookbook seamlessly.',
      proposedPrice: 350,
      estimatedDeliveryDays: 3,
      portfolioLinks: ['https://instagram.com/sofia.althaus'],
      status: 'pending',
    });

    // 6. Create Active and Completed Deals
    const dealCompleted = await Deal.create({
      requirement: req1._id,
      business: biz1._id,
      creator: creator1._id,
      title: 'Apex Sonic Pro ANC Headphones Review & Studio B-Roll',
      description: '60s 4K video showing real-world noise isolation and soundstage testing.',
      agreedPrice: 450,
      packageTier: 'standard',
      deliverables: ['1 4K Dedicated Vertical Video', '3 High-Res Thumbnail Options', '2 Story Mentions'],
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      paymentStatus: 'released',
      workSubmission: {
        note: 'Uploaded the 4K Master Video to Google Drive and published the Reel on Instagram (@alex.vance). Gained over 65,000 views in the first 48 hours!',
        links: ['https://drive.google.com/sample-footage-4k', 'https://instagram.com/reel/sample123'],
        files: [],
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      timeline: [
        {
          status: 'accepted',
          note: 'Offer accepted and collaboration initialized.',
          updatedBy: biz1._id,
          timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'in_progress',
          note: 'Creator received headphones package and started filming.',
          updatedBy: creator1._id,
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'submitted',
          note: 'Creator submitted video proof and analytics snapshot.',
          updatedBy: creator1._id,
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'completed',
          note: 'Deliverables approved by Apex Audio. $450 escrow released.',
          updatedBy: biz1._id,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
      hasBusinessReviewed: true,
      hasCreatorReviewed: true,
    });

    const dealActive = await Deal.create({
      requirement: null,
      business: biz3._id,
      creator: creator4._id,
      title: 'NovaFit Plant Protein Recovery Sprint Campaign',
      description: 'Direct collaboration for post-workout reel and hydration story series.',
      agreedPrice: 320,
      packageTier: 'custom',
      deliverables: ['1 High-Energy Training Reel', '2 Story Mentions', 'Promo Link in Bio'],
      deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      paymentStatus: 'escrowed',
      timeline: [
        {
          status: 'pending',
          note: 'Direct offer sent by NovaFit.',
          updatedBy: biz3._id,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'in_progress',
          note: 'Marcus accepted offer. Filming in Austin fitness center.',
          updatedBy: creator4._id,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // 7. Create Reviews
    await Review.create({
      deal: dealCompleted._id,
      reviewer: biz1._id,
      reviewee: creator1._id,
      role: 'business_to_creator',
      rating: 5,
      comment: 'Alex delivered phenomenal production value! The macro b-roll shots of our headphones and the genuine audio review generated over 450 link clicks to our store within 48 hours. Absolute professional, will hire again!',
      skillsRatings: { communication: 5, quality: 5, timeliness: 5 },
    });

    await Review.create({
      deal: dealCompleted._id,
      reviewer: creator1._id,
      reviewee: biz1._id,
      role: 'creator_to_business',
      rating: 5,
      comment: 'Apex Audio was an absolute pleasure to collaborate with. Clear campaign brief, rapid feedback on drafts, and instant escrow release upon submission.',
      skillsRatings: { communication: 5, quality: 5, timeliness: 5 },
    });

    // 8. Create Conversation & Messages
    const conv = await Conversation.create({
      participants: [biz1._id, creator1._id],
      deal: dealCompleted._id,
      lastMessage: {
        text: 'Thanks again for the awesome collaboration Alex! We are looking to book you for our summer earbuds launch as well.',
        sender: biz1._id,
        createdAt: new Date(),
      },
    });

    await Message.create({
      conversation: conv._id,
      sender: biz1._id,
      recipient: creator1._id,
      text: 'Hi Alex! We love your tech reviews and just accepted your proposal for the ANC Headphones campaign.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isRead: true,
    });

    await Message.create({
      conversation: conv._id,
      sender: creator1._id,
      recipient: biz1._id,
      text: 'Awesome! Package arrived today in the studio. I am testing the frequency response and ANC algorithms now.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      isRead: true,
    });

    await Message.create({
      conversation: conv._id,
      sender: biz1._id,
      recipient: creator1._id,
      text: 'Thanks again for the awesome collaboration Alex! We are looking to book you for our summer earbuds launch as well.',
      createdAt: new Date(),
      isRead: false,
    });

    // 9. Create Notifications
    await Notification.create({
      recipient: creator1._id,
      sender: biz1._id,
      type: 'deal_completed',
      title: 'Deal Completed & Escrow Released! 💰',
      message: 'Apex Audio Technologies approved your deliverables and released $450.',
      link: `/deals/${dealCompleted._id}`,
      isRead: false,
    });

    await Notification.create({
      recipient: creator1._id,
      sender: biz1._id,
      type: 'review_received',
      title: 'New 5-Star Review Received! ⭐',
      message: 'Apex Audio left you a 5-star review: "Alex delivered phenomenal production value!"',
      link: `/deals/${dealCompleted._id}`,
      isRead: false,
    });

    console.log('[Adloom Seeder] Database populated successfully with rich realistic data!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Admin:    admin@adloom.com    / password123');
    console.log('Creator:  creator@adloom.com  / password123');
    console.log('Business: business@adloom.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('[Adloom Seeder Error]:', err);
    process.exit(1);
  }
};

seedData();
