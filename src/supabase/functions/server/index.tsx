import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods - MUST be before all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  }),
);

// Handle preflight requests explicitly
app.options("/*", (c) => {
  return c.text("", 204);
});

// Health check endpoint
app.get("/make-server-deab0cbd/health", (c) => {
  console.log("Health check called");
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Initialize products endpoint - can be called to seed the database
app.post("/make-server-deab0cbd/init-products", async (c) => {
  try {
    console.log("Initializing products...");
    
    const initialProducts = [
      {
        id: '1',
        name: 'Black T-shirt Split Stone Face',
        nameEl: 'Μαύρ T-shirt Split Stone Face',
        price: 28,
        image: 'https://images.unsplash.com/photo-1711641066085-5236bf7afcd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTcyNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004',
        material: {
          en: '100% Premium Cotton',
          el: '100% Εκλεκτό Βαμβάκι'
        },
        description: {
          en: 'A striking design featuring a split stone face inspired by ancient mythology. Perfect for those who appreciate bold artistic statements.',
          el: 'Εντυπωσιακός σχεδιασμός με διχασμένο πέτρινο πρόσωπο εμπνευσμένο από την αρχαία μυθολογία. Ιδανικό για όσους εκτιμούν τολμηρές καλλιτεχνικές δηλώσεις.'
        },
        care: {
          en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
          el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
        },
        features: {
          en: ['Soft and breathable fabric', 'Durable print quality', 'Comfortable regular fit', 'Pre-shrunk material'],
          el: ['Απαλό και αναπνέον ύφασμα', 'Ανθεκτική ποιότητα εκτύπωσης', 'Άνετη κανονική εφαρμογή', 'Προσυρρικνωμένο υλικό']
        }
      },
      {
        id: '2',
        name: 'Medusa Mask T-shirt',
        nameEl: 'T-shirt Μάσκα Μέδουσας',
        price: 28,
        image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTUwMzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02',
        material: {
          en: '100% Premium Cotton',
          el: '100% Εκλεκτό Βαμβάκι'
        },
        description: {
          en: 'Featuring the iconic Medusa mask design, this t-shirt combines ancient mythology with modern streetwear aesthetics.',
          el: 'Με το εμβληματικό σχέδιο της μάσκας της Μέδουσας, αυτό το μπλουζάκι συνδυάζει την αρχαία μυθολογία με τη σύγχρονη αισθητική του δρόμου.'
        },
        care: {
          en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
          el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδεώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
        },
        features: {
          en: ['Soft and breathable fabric', 'Durable print quality', 'Comfortable regular fit', 'Pre-shrunk material'],
          el: ['Απαλό και αναπνέον ύφασμα', 'Ανθεκτική ποιότητα εκτύπωσης', 'Άνετη κανονική εφαρμογή', 'Προσυρρικνωμένο υλικό']
        }
      },
      {
        id: '5',
        name: 'Gorgonstone Sweatshirt',
        nameEl: 'Gorgonstone Φούτερ',
        price: 36,
        image: 'https://images.unsplash.com/photo-1614173968962-0e61c5ed196f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN3ZWF0c2hpcnR8ZW58MXx8fHwxNzYzOTk5OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03',
        material: {
          en: '80% Cotton, 20% Polyester',
          el: '80% Βαμβάκι, 20% Πολυεστέρας'
        },
        description: {
          en: 'Classic crewneck sweatshirt with premium cotton blend. Perfect for layering or wearing on its own.',
          el: 'Κλασική μπλούζα με στρογγυλή λαιμόκοψη και εκλεκτό μείγμα βαμβακιού. Ιδανική για συνδυασμούς ή μόνη της.'
        },
        care: {
          en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
          el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
        },
        features: {
          en: ['Soft fleece interior', 'Comfortable crew neck', 'Ribbed cuffs and hem', 'Durable construction'],
          el: ['Απαλό εσωτερικό fleece', 'Άνετη στρογγυλή λαιμόκοψη', 'Λαστιχωτά μανίκια και τελείωμα', 'Ανθεκτική κατασκευή']
        }
      },
      {
        id: '3',
        name: 'Ammon Horns Medusa Hoodie',
        nameEl: 'Ammon Horns Medusa Hoodie',
        price: 40,
        image: 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00',
        colors: ['Black', 'White'],
        imageVariants: {
          'Black': 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          'White': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        material: {
          en: '80% Cotton, 20% Polyester',
          el: '80% Βαμβάκι, 20% Πολυεστέρας'
        },
        description: {
          en: 'Premium quality hoodie with exceptional comfort and warmth. Features a unique mythological design that stands out.',
          el: 'Φούτερ υψηλής ποιότητας με εξαιρετική άνεση και ζεστασιά. Διαθέτει μοναδικό μυθολογικό σχέδιο που ξεχωρίζει.'
        },
        care: {
          en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
          el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
        },
        features: {
          en: ['Fleece-lined interior', 'Adjustable drawstring hood', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
          el: ['Εσωτερική επένδυση fleece', 'Ρυθμιζόμενη κουκούλα με κορδόνι', 'Τσέπη καγκουρό', 'Λαστιχωτά μανίκια και τελείωμα']
        }
      }
    ];

    await kv.set('products', initialProducts);
    
    console.log("Products initialized successfully!");
    return c.json({ success: true, count: initialProducts.length, products: initialProducts });
  } catch (error) {
    console.error("Init products error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Force clear and reinitialize products (public endpoint for testing)
app.post("/make-server-deab0cbd/force-reset-products", async (c) => {
  try {
    console.log("Force reset products requested...");
    
    // Clear existing products first
    await kv.del('products');
    console.log("Existing products cleared");
    
    const initialProducts = [
      {
        id: '1',
        name: 'Black T-shirt Split Stone Face',
        nameEl: 'Μαύρο T-shirt Split Stone Face',
        price: 28,
        image: 'https://images.unsplash.com/photo-1711641066085-5236bf7afcd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTcyNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004',
        material: {
          en: '100% Premium Cotton',
          el: '100% Εκλεκτό Βαμβάκι'
        },
        description: {
          en: 'A striking design featuring a split stone face inspired by ancient mythology.',
          el: 'Εντυπωσιακός σχεδιασμός με διχασμένο πέτρινο πρόσωπο εμπνευσμένο από την αρχαία μυθολογία.'
        }
      },
      {
        id: '2',
        name: 'Medusa Mask T-shirt',
        nameEl: 'T-shirt Μάσκα Μέδουσας',
        price: 28,
        image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTUwMzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02',
        material: {
          en: '100% Premium Cotton',
          el: '100% Εκλεκτό Βαμβάκι'
        },
        description: {
          en: 'Featuring the iconic Medusa mask design.',
          el: 'Με το εμβληματικό σχέδιο της μάσκας της Μέδουσας.'
        }
      },
      {
        id: '5',
        name: 'Gorgonstone Sweatshirt',
        nameEl: 'Gorgonstone ούτερ',
        price: 36,
        image: 'https://images.unsplash.com/photo-1614173968962-0e61c5ed196f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN3ZWF0c2hpcnR8ZW58MXx8fHwxNzYzOTk5OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03',
        material: {
          en: '80% Cotton, 20% Polyester',
          el: '80% Βαμβάκι, 20% Πολυεστέρας'
        },
        description: {
          en: 'Classic crewneck sweatshirt with premium cotton blend.',
          el: 'Κλασική μπλούζα με στρογγυλή λαιμόκοψη και εκλεκτό μείγμα βαμβακιού.'
        }
      },
      {
        id: '3',
        name: 'Ammon Horns Medusa Hoodie',
        nameEl: 'Ammon Horns Medusa Hoodie',
        price: 40,
        image: 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00',
        colors: ['Black', 'White'],
        imageVariants: {
          'Black': 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          'White': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
        },
        material: {
          en: '80% Cotton, 20% Polyester',
          el: '80% Βαμβάκι, 20% Πολυεστέρας'
        },
        description: {
          en: 'Premium quality hoodie with exceptional comfort.',
          el: 'Φούτερ υψηλής ποιότητας με εξαιρετική άνεση.'
        }
      }
    ];

    await kv.set('products', initialProducts);
    
    console.log("✅ Products force reset successfully with Unsplash images!");
    return c.json({ 
      success: true, 
      message: 'Products cleared and reinitialized with Unsplash images',
      count: initialProducts.length, 
      products: initialProducts 
    });
  } catch (error) {
    console.error("Force reset products error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Create Stripe checkout session
app.post("/make-server-deab0cbd/create-checkout", async (c) => {
  try {
    console.log("Starting checkout session creation...");
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found in environment variables");
      return c.json({ error: "Stripe configuration error - missing secret key" }, 500);
    }

    // Log the key type (test vs live) - SAFE to log, shows only prefix
    const keyPrefix = stripeSecretKey.substring(0, 8); // Shows "sk_test_" or "sk_live_"
    console.log(`✅ Stripe key type detected: ${keyPrefix}...`);
    console.log(`🔑 Using ${keyPrefix.includes('test') ? 'TEST' : 'LIVE'} mode`);

    console.log("Stripe key found, initializing Stripe...");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const body = await c.req.json();
    const { items, locale, shippingCountry, shippingCost } = body;

    console.log("Received items:", JSON.stringify(items));
    console.log("Received locale:", locale);
    console.log("Received shipping country:", shippingCountry);
    console.log("Received shipping cost:", shippingCost);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items provided:", items);
      return c.json({ error: "Invalid items provided" }, 400);
    }

    if (!shippingCountry || !shippingCost) {
      console.error("Missing shipping information");
      return c.json({ error: "Missing shipping information" }, 400);
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      let productName = item.name;
      if (item.color) {
        productName = `${item.name} - ${item.color}`;
      }
      productName += ` - Size: ${item.size}`;
      
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    console.log("Creating Stripe checkout session with line items:", JSON.stringify(lineItems));

    // Get the base URL from origin
    const origin = c.req.header("origin") || "https://gorgonstone-merch.verch.app";
    
    // Determine Stripe locale - 'el' for Greek, 'en' for English (default)
    const stripeLocale = locale === 'el' ? 'el' : 'en';
    console.log(`Setting Stripe checkout locale to: ${stripeLocale}`);
    
    // Determine delivery estimate based on country
    let deliveryMin = 2;
    let deliveryMax = 3;
    if (shippingCountry === 'CY') {
      deliveryMin = 3;
      deliveryMax = 5;
    } else if (shippingCountry !== 'GR') {
      deliveryMin = 5;
      deliveryMax = 7;
    }

    // Create a single shipping rate for the selected country
    console.log(`Creating shipping rate for ${shippingCountry}...`);
    const shippingRateName = locale === 'el' ? 'ACS Courier (Κατ\'οίκον)' : 'ACS Courier (Home)';
    const shippingRate = await stripe.shippingRates.create({
      display_name: shippingRateName,
      type: 'fixed_amount',
      fixed_amount: {
        amount: Math.round(shippingCost * 100), // Convert to cents
        currency: 'eur',
      },
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: deliveryMin,
        },
        maximum: {
          unit: 'business_day',
          value: deliveryMax,
        },
      },
      metadata: {
        country: shippingCountry,
        locale: locale,
      },
    });

    console.log(`Created shipping rate: ${shippingRate.id} for ${shippingCountry} (${shippingCost}€)`);
    
    // Create checkout session with the specific shipping rate
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/cart`,
      locale: stripeLocale,
      phone_number_collection: {
        enabled: true, // Required for shipping company to contact customer
      },
      shipping_address_collection: {
        allowed_countries: [shippingCountry], // Only allow the selected country
      },
      shipping_options: [
        { shipping_rate: shippingRate.id },
      ],
    });

    console.log("Checkout session created successfully:", session.id);
    console.log("Checkout URL:", session.url);

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return c.json({ 
      error: `Failed to create checkout session: ${error.message}`,
      details: error.toString()
    }, 500);
  }
});

// Authentication Routes

// Sign up route
app.post("/make-server-deab0cbd/auth/signup", async (c) => {
  try {
    console.log("Sign up request received");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Error creating user:", error.message);
      return c.json({ error: error.message }, 400);
    }

    console.log("User created successfully:", data.user.id);
    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        name: data.user.user_metadata.name 
      } 
    });
  } catch (error) {
    console.error("Sign up error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Check if user is admin
app.get("/make-server-deab0cbd/auth/check-admin", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ isAdmin: false }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ isAdmin: false }, 401);
    }

    // Check if user email is admin (you can change this logic)
    const adminEmails = ['admin@gorgonstone.com', 'charavits@gmail.com', 'charavts1@gmail.com'];
    const isAdmin = adminEmails.includes(user.email || '');

    return c.json({ isAdmin, userId: user.id, email: user.email });
  } catch (error) {
    console.error("Check admin error:", error.message);
    return c.json({ isAdmin: false }, 500);
  }
});

// Admin Routes - Protected

// Get all products
app.get("/make-server-deab0cbd/admin/products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get products from KV store
    const products = await kv.get('products');
    return c.json({ products: products || [] });
  } catch (error) {
    console.error("Get products error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Delete a product
app.delete("/make-server-deab0cbd/admin/products/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if admin
    const adminEmails = ['admin@gorgonstone.com', 'charavits@gmail.com', 'charavts1@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    // Get products from KV store
    const products = await kv.get('products');
    if (!products) {
      return c.json({ error: 'No products found' }, 404);
    }

    // Find and remove the product
    const updatedProducts = products.filter((product: any) => product.id !== productId);
    await kv.set('products', updatedProducts);

    console.log("Product deleted successfully by admin:", user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Get site settings
app.get("/make-server-deab0cbd/admin/site-settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const settings = await kv.get('site_settings');
    return c.json({ settings: settings || getDefaultSiteSettings() });
  } catch (error) {
    console.error("Get site settings error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Update site settings
app.post("/make-server-deab0cbd/admin/site-settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if admin
    const adminEmails = ['admin@gorgonstone.com', 'charavits@gmail.com', 'charavts1@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return c.json({ error: 'Unauthorized - Admin only' }, 403);
    }

    const { settings } = await c.req.json();
    console.log("Updating site settings:", settings);

    await kv.set('site_settings', settings);
    return c.json({ success: true, settings });
  } catch (error) {
    console.error("Update site settings error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Public endpoint to get site settings
app.get("/make-server-deab0cbd/site-settings", async (c) => {
  try {
    const settings = await kv.get('site_settings');
    console.log('📡 Public site-settings endpoint called');
    console.log('📦 Settings from KV store:', JSON.stringify(settings, null, 2));
    return c.json({ settings: settings || getDefaultSiteSettings() });
  } catch (error) {
    console.error("Get site settings error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Helper function for default site settings
function getDefaultSiteSettings() {
  return {
    contactEmail: 'infogorgonstone@gmail.com',
    responseTime: {
      en: 'We typically respond in 24-48 hours',
      el: 'Συνήθως απαντάμε εντός 24-48 ωρών'
    },
    shippingCosts: {
      'GR': { name: 'Ελλάδα', nameEn: 'Greece', cost: 3.50 },
      'CY': { name: 'Κύπρος', nameEn: 'Cyprus', cost: 7.00 },
      'IT': { name: 'Ιταλία', nameEn: 'Italy', cost: 12.00 },
      'ES': { name: 'Ισπανία', nameEn: 'Spain', cost: 12.00 },
      'FR': { name: 'Γαλλία', nameEn: 'France', cost: 12.00 },
      'DE': { name: 'Γερμανία', nameEn: 'Germany', cost: 12.00 },
      'AT': { name: 'Αυστρία', nameEn: 'Austria', cost: 12.00 },
      'BE': { name: 'Βέλγιο', nameEn: 'Belgium', cost: 12.00 },
      'BG': { name: 'Βουλγαρία', nameEn: 'Bulgaria', cost: 12.00 },
      'HR': { name: 'Κρατία', nameEn: 'Croatia', cost: 12.00 },
      'CZ': { name: 'Τεχία', nameEn: 'Czech Republic', cost: 12.00 },
      'DK': { name: 'Δανία', nameEn: 'Denmark', cost: 12.00 },
      'EE': { name: 'Εσθονία', nameEn: 'Estonia', cost: 12.00 },
      'FI': { name: 'Φινλανδία', nameEn: 'Finland', cost: 12.00 },
      'HU': { name: 'Ουγγαρία', nameEn: 'Hungary', cost: 12.00 },
      'IE': { name: 'Ιρλανδία', nameEn: 'Ireland', cost: 12.00 },
      'LV': { name: 'Λετονία', nameEn: 'Latvia', cost: 12.00 },
      'LT': { name: 'Λιθουανία', nameEn: 'Lithuania', cost: 12.00 },
      'LU': { name: 'Λουξεμβούργο', nameEn: 'Luxembourg', cost: 12.00 },
      'MT': { name: 'άλτα', nameEn: 'Malta', cost: 12.00 },
      'NL': { name: 'Ολλανδία', nameEn: 'Netherlands', cost: 12.00 },
      'PL': { name: 'Πολωνία', nameEn: 'Poland', cost: 12.00 },
      'PT': { name: 'Πορτογαλία', nameEn: 'Portugal', cost: 12.00 },
      'RO': { name: 'Ρουμανία', nameEn: 'Romania', cost: 12.00 },
      'SK': { name: 'Σλοβακία', nameEn: 'Slovakia', cost: 12.00 },
      'SI': { name: 'Σλοβενία', nameEn: 'Slovenia', cost: 12.00 },
      'SE': { name: 'Σουηδία', nameEn: 'Sweden', cost: 12.00 }
    },
    aboutContent: {
      en: {
        paragraph1: 'This art-driven T-shirt project is built on a deep sensitivity toward the aesthetics, history, and cultural power of the ancient world. Each design draws inspiration from the myths, heroes, and daemons that shaped early civilizations, celebrating the timeless connection between storytelling and visual art.',
        paragraph2: 'The core inspiration comes from the legendary tale of Perseus and Medusa—an eternal symbol of courage, transformation, and the blurred line between monster and myth. Along with the broader era of heroes, these narratives fuel a collection that merges ancient symbolism with modern expression.',
        paragraph3: 'Every piece aims to bring the spirit of antiquity into the present, allowing wearers to carry fragments of myth, sculpture, and history as living forms of art.'
      },
      el: {
        paragraph1: 'Αυτό το art-driven T-shirt project βασίζεται σ μια βαθιά ευαισθησία απένατι στην αισθητική, την ιστορία και τη πολιτιστική δύναμ�� του αρχαίου κόσμου. Κάθε σχέδιο εμπνέεται από τους μύθους, τους ήρωες και τους δαίμονες που διαμόρφωσαν τους πρώτους πολιτισμούς, γιορτάζοντας την αιώνια σύνδεση μεταξύ αφήγησης και οπτικής τέχνης.',
        paragraph2: 'Η βασική έμπνευση προέρχεται από τν θρυλικό μύθο του Περσέα και της Μέδουσας—ένα αιώνιο σύμβολο θάρρους, μεταμόρφωσης και της θλής γραμμής μεταξύ τέρατος και μύθου. Μαζί με την ευρύτερη εποχή των ηρώων, αυτές οι αφηγήσεις τροφοδοτούν μια συλλογή που συνδυάζει τον αρχαίο συμβολισμό με τη σύγχρονη έκφραση.',
        paragraph3: 'Κάθε κομμάτι στοχεει να φέρει το πνεύμα της αρχαιότητας στο παρόν, επιτρέποντας στους φορείς να μεταφέρουν θραύσματα μύθου, γλυπτικής και ιστορίας ως ζωντανές μορφές τέχνης.'
      }
    },
    logoUrl: '' // No default logo - will show "GORGONSTONE" text until admin uploads a logo
  };
}

// Stripe checkout endpoint
app.post("/make-server-deab0cbd/create-checkout", async (c) => {
  try {
    console.log("Starting checkout session creation...");
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found in environment variables");
      return c.json({ error: "Stripe configuration error - missing secret key" }, 500);
    }

    // Log the key type (test vs live) - SAFE to log, shows only prefix
    const keyPrefix = stripeSecretKey.substring(0, 8); // Shows "sk_test_" or "sk_live_"
    console.log(`✅ Stripe key type detected: ${keyPrefix}...`);
    console.log(`🔑 Using ${keyPrefix.includes('test') ? 'TEST' : 'LIVE'} mode`);

    console.log("Stripe key found, initializing Stripe...");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const body = await c.req.json();
    const { items, locale, shippingCountry, shippingCost } = body;

    console.log("Received items:", JSON.stringify(items));
    console.log("Received locale:", locale);
    console.log("Received shipping country:", shippingCountry);
    console.log("Received shipping cost:", shippingCost);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items provided:", items);
      return c.json({ error: "Invalid items provided" }, 400);
    }

    if (!shippingCountry || !shippingCost) {
      console.error("Missing shipping information");
      return c.json({ error: "Missing shipping information" }, 400);
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      let productName = item.name;
      if (item.color) {
        productName = `${item.name} - ${item.color}`;
      }
      productName += ` - Size: ${item.size}`;
      
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    console.log("Creating Stripe checkout session with line items:", JSON.stringify(lineItems));

    // Get the base URL from origin
    const origin = c.req.header("origin") || "https://gorgonstone-merch.verch.app";
    
    // Determine Stripe locale - 'el' for Greek, 'en' for English (default)
    const stripeLocale = locale === 'el' ? 'el' : 'en';
    console.log(`Setting Stripe checkout locale to: ${stripeLocale}`);
    
    // Determine delivery estimate based on country
    let deliveryMin = 2;
    let deliveryMax = 3;
    if (shippingCountry === 'CY') {
      deliveryMin = 3;
      deliveryMax = 5;
    } else if (shippingCountry !== 'GR') {
      deliveryMin = 5;
      deliveryMax = 7;
    }

    // Create a single shipping rate for the selected country
    console.log(`Creating shipping rate for ${shippingCountry}...`);
    const shippingRateName = locale === 'el' ? 'ACS Courier (Κατ\'οίκον)' : 'ACS Courier (Home)';
    const shippingRate = await stripe.shippingRates.create({
      display_name: shippingRateName,
      type: 'fixed_amount',
      fixed_amount: {
        amount: Math.round(shippingCost * 100), // Convert to cents
        currency: 'eur',
      },
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: deliveryMin,
        },
        maximum: {
          unit: 'business_day',
          value: deliveryMax,
        },
      },
      metadata: {
        country: shippingCountry,
        locale: locale,
      },
    });

    console.log(`Created shipping rate: ${shippingRate.id} for ${shippingCountry} (${shippingCost}€)`);
    
    // Create checkout session with the specific shipping rate
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/cart`,
      locale: stripeLocale,
      phone_number_collection: {
        enabled: true, // Required for shipping company to contact customer
      },
      shipping_address_collection: {
        allowed_countries: [shippingCountry], // Only allow the selected country
      },
      shipping_options: [
        { shipping_rate: shippingRate.id },
      ],
    });

    console.log("Checkout session created successfully:", session.id);
    console.log("Checkout URL:", session.url);

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return c.json({ 
      error: `Failed to create checkout session: ${error.message}`,
      details: error.toString()
    }, 500);
  }
});

// Public endpoint to get products (no authentication required)
app.get("/make-server-deab0cbd/products", async (c) => {
  try {
    console.log("Fetching products from KV store...");
    const products = await kv.get('products');
    console.log("Products found:", products ? products.length : 0);
    
    // Filter out hidden products for public view
    const visibleProducts = (products || []).filter((p: any) => !p.hidden);
    console.log("Visible products:", visibleProducts.length);
    
    return c.json({ products: visibleProducts });
  } catch (error) {
    console.error("Get products error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Update products
app.post("/make-server-deab0cbd/admin/products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if admin
    const adminEmails = ['admin@gorgonstone.com', 'charavits@gmail.com', 'charavts1@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const body = await c.req.json();
    const { products } = body;

    // Save products to KV store
    await kv.set('products', products);

    console.log("Products updated successfully by admin:", user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Update products error:", error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Upload product image endpoint
app.post("/make-server-deab0cbd/upload-image", async (c) => {
  try {
    console.log("Upload image request received");

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user is authenticated and is admin
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error('Auth error:', authError?.message);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Check if user is admin
    const adminEmail = 'charavts1@gmail.com';
    if (user.email !== adminEmail) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Create bucket if it doesn't exist
    const bucketName = 'make-deab0cbd-product-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return c.json({ error: `Failed to create storage bucket: ${createError.message}` }, 500);
      }
    }

    // Parse form data
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only images are allowed.' }, 400);
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;

    console.log(`Uploading file: ${fileName}, size: ${file.size}, type: ${file.type}`);

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully:', urlData.publicUrl);

    return c.json({ 
      success: true, 
      url: urlData.publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload image error:', error.message);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

// ============== ORDERS ENDPOINTS ==============

// Retrieve Stripe session and save order (called from Success page)
app.post("/make-server-deab0cbd/retrieve-and-save-order", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.error('❌ Unauthorized - no valid user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { sessionId } = await c.req.json();
    
    if (!sessionId) {
      return c.json({ error: 'Session ID required' }, 400);
    }

    console.log('💾 Retrieving Stripe session and saving order:', sessionId);
    console.log('👤 User:', user.id, user.email);

    // Check if order already exists (use payment intent ID as unique identifier)
    const orderKey = `order_${user.id}_${paymentIntentId}`;
    const existingOrder = await kv.get(orderKey);
    
    if (existingOrder) {
      console.log('✅ Order already saved, returning existing order');
      return c.json({ success: true, order: existingOrder, alreadyExists: true });
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return c.json({ error: "Stripe configuration error" }, 500);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details', 'shipping_cost', 'shipping_details', 'payment_intent']
    });

    console.log('📦 Retrieved Stripe session:', session.id);
    console.log('💰 Amount total:', session.amount_total);
    console.log('🛒 Line items count:', session.line_items?.data?.length);
    
    // Get payment intent ID
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id;

    if (!paymentIntentId) {
      console.error('❌ No payment intent found for session');
      return c.json({ error: 'No payment intent found' }, 400);
    }

    console.log('✅ Payment Intent ID:', paymentIntentId);

    if (!session.line_items || !session.line_items.data || session.line_items.data.length === 0) {
      console.error('❌ No line items in session');
      return c.json({ error: 'Invalid session - no items' }, 400);
    }

    // Extract order items from line items
    const items = session.line_items.data.map((lineItem: any) => {
      // Parse product name to extract details
      // Format: "Product Name - Color - Size: X" or "Product Name - Size: X"
      const name = lineItem.description || '';
      const sizeMatch = name.match(/Size:\s*(\w+)/i);
      const colorMatch = name.match(/-\s*(\w+)\s*-\s*Size/i);
      
      let productName = name;
      if (sizeMatch) {
        productName = name.split(' - Size:')[0];
      }
      
      return {
        name: productName,
        quantity: lineItem.quantity,
        price: lineItem.amount_total / 100 / lineItem.quantity, // Convert from cents and divide by quantity
        size: sizeMatch ? sizeMatch[1] : 'M',
        color: colorMatch ? colorMatch[1] : undefined,
        image: '', // Will be populated below
      };
    });

    // Get products from KV store to match images
    const products = await kv.get('products') || [];
    
    // Match product names to get images
    items.forEach((item: any) => {
      const product = products.find((p: any) => {
        const baseName = item.name.split(' - ')[0]; // Remove color if present
        return p.name === baseName || p.nameEl === baseName || p.name === item.name;
      });
      
      if (product) {
        // If product has color variants, use the correct image
        if (item.color && product.imageVariants && product.imageVariants[item.color]) {
          item.image = product.imageVariants[item.color];
        } else {
          item.image = product.image;
        }
        item.productId = product.id;
        item.nameEl = product.nameEl;
      }
    });

    // Calculate total and shipping
    const total = session.amount_total ? session.amount_total / 100 : 0;
    const shippingCost = session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0;
    const itemsTotal = total - shippingCost;

    // Extract shipping address
    const shippingDetails = session.shipping_details || session.customer_details;
    const shippingAddress = {
      name: shippingDetails?.name || session.customer_details?.name || 'Customer',
      email: session.customer_details?.email || user.email || '',
      address: shippingDetails?.address?.line1 || '',
      city: shippingDetails?.address?.city || '',
      postalCode: shippingDetails?.address?.postal_code || '',
      country: shippingDetails?.address?.country || ''
    };

    // Create order object
    const order = {
      orderId: paymentIntentId,
      sessionId: sessionId, // Keep session ID for reference
      userId: user.id,
      userEmail: user.email,
      items,
      total: itemsTotal,
      shippingCost,
      shippingAddress,
      paymentMethod: 'Card (****)',
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    // Save order to KV store
    await kv.set(orderKey, order);

    console.log('✅ Order saved successfully:', orderKey);

    return c.json({ success: true, order });
  } catch (error) {
    console.error('❌ Retrieve and save order error:', error.message);
    console.error('Stack:', error.stack);
    return c.json({ error: error.message }, 500);
  }
});

// Save order after successful Stripe payment (OLD - keeping for backwards compatibility)
app.post("/make-server-deab0cbd/save-order", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.error('❌ Unauthorized - no valid user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { orderId, items, total, shippingCost, shippingAddress, paymentMethod } = await c.req.json();
    
    console.log('💾 Saving order for user:', user.id);
    console.log('📦 Order ID:', orderId);
    console.log('🛒 Items:', items);
    console.log('💰 Total:', total);

    if (!orderId || !items || !total || !shippingAddress) {
      return c.json({ error: 'Missing required order data' }, 400);
    }

    // Create order object
    const order = {
      orderId,
      userId: user.id,
      userEmail: user.email,
      items,
      total,
      shippingCost: shippingCost || 0,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    // Save order to KV store with key: order_{userId}_{orderId}
    const orderKey = `order_${user.id}_${orderId}`;
    await kv.set(orderKey, order);

    console.log('✅ Order saved successfully:', orderKey);

    return c.json({ success: true, order });
  } catch (error) {
    console.error('❌ Save order error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Get user's orders
app.get("/make-server-deab0cbd/my-orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.error('❌ Unauthorized - no valid user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('📦 Fetching orders for user:', user.id);

    // Get all orders for this user (prefix: order_{userId}_)
    const orderPrefix = `order_${user.id}_`;
    const orders = await kv.getByPrefix(orderPrefix);

    console.log('✅ Found orders:', orders.length);

    // Get products to enrich orders with images if missing
    const products = await kv.get('products') || [];

    // Enrich orders with product images if missing
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        // If item doesn't have an image, try to match it with products
        if (!item.image || item.image === '') {
          const product = products.find((p: any) => {
            const baseName = item.name.split(' - ')[0];
            return p.name === baseName || p.nameEl === baseName || p.name === item.name;
          });
          
          if (product) {
            // If product has color variants, use the correct image
            if (item.color && product.imageVariants && product.imageVariants[item.color]) {
              item.image = product.imageVariants[item.color];
            } else {
              item.image = product.image;
            }
            item.productId = product.id;
            item.nameEl = product.nameEl;
            
            console.log(`🖼️ Added image for ${item.name}:`, item.image);
          }
        }
      });
    });

    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return c.json({ orders: sortedOrders });
  } catch (error) {
    console.error('❌ Get orders error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Sync orders from Stripe - searches for all successful payments for a user's email
app.post("/make-server-deab0cbd/sync-orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.error('❌ Unauthorized - no valid user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('🔄 Syncing orders from Stripe for user:', user.email);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return c.json({ error: "Stripe configuration error" }, 500);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    // Search for checkout sessions by customer email
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.payment_intent'] // Expand line_items and payment_intent
    });

    console.log(`📊 Found ${sessions.data.length} total Stripe sessions`);

    // Filter for this user's email and completed sessions
    const userSessions = sessions.data.filter((session: any) => {
      const sessionEmail = session.customer_details?.email?.toLowerCase();
      const userEmail = user.email?.toLowerCase();
      const isCompleted = session.payment_status === 'paid';
      
      return sessionEmail === userEmail && isCompleted;
    });

    console.log(`✅ Found ${userSessions.length} completed sessions for ${user.email}`);

    let syncedCount = 0;
    let alreadyExistsCount = 0;
    const syncedOrders = [];

    // Process each session
    for (const session of userSessions) {
      // Get payment intent ID
      const paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id;

      if (!paymentIntentId) {
        console.log(`⏭️ Skipping session ${session.id} - no payment intent`);
        continue;
      }

      const orderKey = `order_${user.id}_${paymentIntentId}`;
      const oldOrderKey = `order_${user.id}_${session.id}`; // Old key format with session ID
      
      // Check if already exists with new format
      const existingOrder = await kv.get(orderKey);
      if (existingOrder) {
        console.log(`⏭️ Order already exists: ${paymentIntentId}`);
        alreadyExistsCount++;
        
        // Clean up old format if it exists (migration cleanup)
        const oldOrder = await kv.get(oldOrderKey);
        if (oldOrder) {
          console.log(`🧹 Cleaning up old order format: ${session.id}`);
          await kv.del(oldOrderKey);
        }
        continue;
      }

      // Check if exists in old format - if so, migrate it
      const oldOrder = await kv.get(oldOrderKey);
      if (oldOrder) {
        console.log(`🔄 Migrating order from old format: ${session.id} → ${paymentIntentId}`);
        
        // Update the order with new ID
        const migratedOrder = {
          ...oldOrder,
          orderId: paymentIntentId,
          sessionId: session.id,
        };
        
        // Save with new key
        await kv.set(orderKey, migratedOrder);
        
        // Delete old key
        await kv.del(oldOrderKey);
        
        syncedOrders.push(migratedOrder);
        syncedCount++;
        
        console.log(`✅ Order migrated: ${paymentIntentId}`);
        continue;
      }

      console.log(`💾 Saving new order: ${paymentIntentId} (session: ${session.id})`);

      // Extract order items from line items
      const items = (session.line_items?.data || []).map((lineItem: any) => {
        const name = lineItem.description || '';
        const sizeMatch = name.match(/Size:\s*(\w+)/i);
        const colorMatch = name.match(/-\s*(\w+)\s*-\s*Size/i);
        
        let productName = name;
        if (sizeMatch) {
          productName = name.split(' - Size:')[0];
        }
        
        return {
          name: productName,
          quantity: lineItem.quantity,
          price: lineItem.amount_total / 100 / lineItem.quantity,
          size: sizeMatch ? sizeMatch[1] : 'M',
          color: colorMatch ? colorMatch[1] : undefined,
          image: '', // Will be populated below
        };
      });

      // Get products from KV store to match images
      const products = await kv.get('products') || [];
      
      // Match product names to get images
      items.forEach((item: any) => {
        const product = products.find((p: any) => {
          const baseName = item.name.split(' - ')[0]; // Remove color if present
          return p.name === baseName || p.nameEl === baseName || p.name === item.name;
        });
        
        if (product) {
          // If product has color variants, use the correct image
          if (item.color && product.imageVariants && product.imageVariants[item.color]) {
            item.image = product.imageVariants[item.color];
          } else {
            item.image = product.image;
          }
          item.productId = product.id;
          item.nameEl = product.nameEl;
        }
      });

      // Calculate totals
      const total = session.amount_total ? session.amount_total / 100 : 0;
      const shippingCost = session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0;
      const itemsTotal = total - shippingCost;

      // Extract shipping address
      const shippingDetails = session.shipping_details || session.customer_details;
      const shippingAddress = {
        name: shippingDetails?.name || session.customer_details?.name || 'Customer',
        email: session.customer_details?.email || user.email || '',
        address: shippingDetails?.address?.line1 || '',
        city: shippingDetails?.address?.city || '',
        postalCode: shippingDetails?.address?.postal_code || '',
        country: shippingDetails?.address?.country || ''
      };

      // Create order object
      const order = {
        orderId: paymentIntentId,
        sessionId: session.id, // Keep session ID for reference
        userId: user.id,
        userEmail: user.email,
        items,
        total: itemsTotal,
        shippingCost,
        shippingAddress,
        paymentMethod: 'Card (****)',
        status: 'paid',
        createdAt: new Date(session.created * 1000).toISOString(), // Convert Unix timestamp
      };

      // Save order
      await kv.set(orderKey, order);
      syncedOrders.push(order);
      syncedCount++;
      
      console.log(`✅ Order saved: ${paymentIntentId}`);
    }

    console.log(`🎉 Sync complete: ${syncedCount} new orders, ${alreadyExistsCount} already existed`);

    return c.json({ 
      success: true, 
      syncedCount,
      alreadyExistsCount,
      totalFound: userSessions.length,
      syncedOrders 
    });
  } catch (error) {
    console.error('❌ Sync orders error:', error.message);
    console.error('Stack:', error.stack);
    return c.json({ error: error.message }, 500);
  }
});

// Cleanup duplicate orders (migration helper)
app.post("/make-server-deab0cbd/cleanup-duplicate-orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.error('❌ Unauthorized - no valid user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('🧹 Starting cleanup for user:', user.email);

    // Get all orders for this user
    const allOrdersData = await kv.getByPrefix(`order_${user.id}_`);
    console.log(`📦 Found ${allOrdersData.length} total orders`);

    // Group orders by sessionId to find duplicates
    const ordersBySession = new Map<string, any[]>();
    
    for (const orderData of allOrdersData) {
      const order = orderData;
      const sessionId = order.sessionId || order.orderId; // sessionId or fallback to orderId
      
      if (!ordersBySession.has(sessionId)) {
        ordersBySession.set(sessionId, []);
      }
      ordersBySession.get(sessionId)!.push(order);
    }

    let deletedCount = 0;
    const duplicates = [];

    // For each session, keep only the one with payment intent ID
    for (const [sessionId, orders] of ordersBySession.entries()) {
      if (orders.length > 1) {
        console.log(`🔍 Found ${orders.length} orders for session ${sessionId}`);
        duplicates.push({ sessionId, count: orders.length });
        
        // Sort: payment intent IDs (pi_) should be kept, session IDs (cs_) should be deleted
        orders.sort((a, b) => {
          const aIsPaymentIntent = a.orderId.startsWith('pi_');
          const bIsPaymentIntent = b.orderId.startsWith('pi_');
          return bIsPaymentIntent ? 1 : -1; // Keep payment intent IDs
        });

        // Delete all except the first one (which should be the payment intent)
        for (let i = 1; i < orders.length; i++) {
          const orderToDelete = orders[i];
          const keyToDelete = `order_${user.id}_${orderToDelete.orderId}`;
          await kv.del(keyToDelete);
          console.log(`🗑️ Deleted duplicate: ${orderToDelete.orderId}`);
          deletedCount++;
        }
      }
    }

    console.log(`✅ Cleanup complete: ${deletedCount} duplicates removed`);

    return c.json({ 
      success: true, 
      deletedCount,
      duplicatesFound: duplicates.length,
      duplicates
    });
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
    console.error('Stack:', error.stack);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);