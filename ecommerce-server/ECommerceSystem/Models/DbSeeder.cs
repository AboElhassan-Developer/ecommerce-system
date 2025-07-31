using Bogus;
using ECommerceSystem.Models;
using Microsoft.EntityFrameworkCore;

public static class DbSeeder
{
    public static async Task Seed(ECommerceDbContext context)
    {
        
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

       
        context.Products.RemoveRange(context.Products);
        await context.SaveChangesAsync();

        
        string[] categoryNames = new[]
        {
            "Smart Home Devices",
            "Home Office Setup",
            "Kitchen Gadgets",
            "Indoor Plants & Decor",
            "Health & Wellness Essentials",
            "Gaming Zone",
            "Kids Smart Fun",
            "DIY & Craft Supplies",
            "Lighting Solutions"
        };

        
        foreach (var name in categoryNames)
        {
            if (!context.Categories.Any(c => c.Name == name))
            {
                context.Categories.Add(new Category { Name = name });
            }
        }
        await context.SaveChangesAsync();

        var categoryDict = context.Categories
            .Where(c => categoryNames.Contains(c.Name))
            .ToDictionary(c => c.Name, c => c.Id);

        if (categoryDict.Count < categoryNames.Length)
            throw new Exception("❌ Some categories could not be found after seeding.");
      
        context.Products.AddRange(
  
            new Product { Name = "Smart Thermostat Pro", Description = "Energy-saving smart thermostat with voice control", Price = 2799, Quantity = 15, CategoryId = categoryDict["Smart Home Devices"], Image = "/images/thermostat.jpg" },
            new Product { Name = "Smart Fitness Tracker", Description = "Monitor your health with real-time data", Price = 999, Quantity = 30, CategoryId = categoryDict["Health & Wellness Essentials"], Image = "/images/Health.jpg" },
            new Product { Name = "Ergonomic Office Chair", Description = "Adjustable chair with lumbar support", Price = 1899, Quantity = 10, CategoryId = categoryDict["Home Office Setup"], Image = "/images/chair.jpg" },
            new Product { Name = "Touchless Soap Dispenser", Description = "Automatic soap dispenser with sensor", Price = 399, Quantity = 50, CategoryId = categoryDict["Kitchen Gadgets"], Image = "/images/kitchen.jpg" },
            new Product { Name = "Mini Indoor Bamboo Plant", Description = "Perfect for desks and shelves", Price = 249, Quantity = 100, CategoryId = categoryDict["Indoor Plants & Decor"], Image = "/images/plant.jpg" },
            new Product { Name = "RGB LED Floor Lamp", Description = "Color-changing lamp with remote control", Price = 799, Quantity = 20, CategoryId = categoryDict["Lighting Solutions"], Image = "/images/lamp.jpg" },
            new Product { Name = "RGB Gaming Mouse", Description = "High precision with customizable buttons", Price = 599, Quantity = 25, CategoryId = categoryDict["Gaming Zone"], Image = "/images/Gaming.jpg" },
            new Product { Name = "Kids' Smart Watch", Description = "GPS enabled watch for kids' safety", Price = 699, Quantity = 20, CategoryId = categoryDict["Kids Smart Fun"], Image = "/images/kidswatch.jpg" },
            new Product { Name = "Acrylic Paint Set", Description = "Complete set for DIY art lovers", Price = 349, Quantity = 40, CategoryId = categoryDict["DIY & Craft Supplies"], Image = "/images/paint.jpg" }
        );
        await context.SaveChangesAsync();

       
        var imageSets = new Dictionary<string, string[]>
        {
            ["Smart Home Devices"] = new[] { "thermostat4.jpg", "smart1.jpg", "thermostat5.jpg",
                                    "thermostat6.jpg", "thermostat2.jpg", "smart2.jpg", "thermostat1.jpg" },
            ["Home Office Setup"] = new[] { "chair1.jpg", "Office6.jpg", "Office5.jpg",
                                           "Office2.jpg", "Office3.jpg",
                                            "Office4.jpg", "Office1.jpg",         },
                                             
            ["Kitchen Gadgets"] = new[] { "kitchen1.jpg", "kitchen2.jpg", "kitchen3.jpg",
                                           "kitchen4.jpg", "kitchen5.jpg","kitchen6.jpg",
                                                   "kitchen7.jpg",},
            ["Indoor Plants & Decor"] = new[] { "plant1.jpg", "plant2.jpg", 
                                               "plant3.jpg", "plant4.jpg",
                                               "plant5.jpg","plant6.jpg", 
                                                  "plant7.jpg", },
            ["Health & Wellness Essentials"] = new[] { "Health1.jpg","Health2.jpg",
                                             "Health3.jpg", "Health4.jpg", "Health5.jpg", 
                                             "Health6.jpg", "Health7.jpg" },
            ["Gaming Zone"] = new[] { "Gaming1.jpg", "Gaming2.jpg", "Gaming3.jpg",
                                    "Gaming4.jpg", "Gaming5.jpg", "Gaming6.jpg"
            ,                            "Gaming7.jpg" },
            ["Kids Smart Fun"] = new[] { "kidswatch1.jpg", "kidswatch2.jpg",
                                      "kids.jpg","kids1.jpg","kids2.jpg",
                                          "kidswatch3.jpg","kidswatch4.jpg"      },
             
            ["DIY & Craft Supplies"] = new[] { "paint1.jpg", "paint2.jpg", 
                                                "paint3.jpg","paint4.jpg",
                                                    "paint5.jpg","paint6.jpg",
                                                  "paint7.jpg"},
            ["Lighting Solutions"] = new[] { "lamp1.jpg", "lamp2.jpg", "lamp3.jpg",
                                          "lamp4.jpg", "lamp5.jpg", "lamp6.jpg", "lamp7.jpg" }
        };

        
        var products = new List<Product>();
        var faker = new Faker("en");

        foreach (var category in categoryDict)
        {
            var images = imageSets[category.Key];
            var categoryId = category.Value;

            var productFaker = new Faker<Product>()
                .RuleFor(p => p.Name, f => f.Commerce.ProductName())
                .RuleFor(p => p.Description, f => f.Commerce.ProductAdjective() + " " + f.Commerce.ProductMaterial())
                .RuleFor(p => p.Price, f => decimal.Parse(f.Commerce.Price(100, 3000)))
                .RuleFor(p => p.Quantity, f => f.Random.Int(5, 70))
                .RuleFor(p => p.CategoryId, f => categoryId)
                .RuleFor(p => p.Image, f => $"/images/{f.PickRandom(images)}")
                .RuleFor(p => p.isFavorite, f => false);

            products.AddRange(productFaker.Generate(7)); 
        }

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
