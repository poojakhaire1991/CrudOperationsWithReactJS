using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrudOperationsWithReactJS.Models;

namespace CrudOperationsWithReactJS.Controllers
{
    public class ProductsController : Controller
    {
        MarsOnboardingEntities1 db = new MarsOnboardingEntities1();
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetProductData()
        {
            var Product = db.Products.Select(x => new {
                ProductId=x.ProductId,
                Name=x.Name,
                Price=x.Price
            }).ToList();
            return Json(Product, JsonRequestBehavior.AllowGet);
        }
        public int CreateProduct(Product prod)
        {
            using (db)
            {
                long id = db.Products.Max(x => x.ProductId);
                prod.ProductId = id + 1;
                db.Products.Add(prod);
                db.SaveChanges();
                return 1;
            }
        }
        public int UpdateProduct(Product prod)
        {
            using (db)
            {
                db.Entry(prod).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return 1;
            }
        }
        public int DeleteProduct(int id)
        {
            using (db)
            {
                var sp = from s in db.SoldProducts where (s.ProductId == id) select s;
                foreach(var soldP in sp)
                {
                    db.SoldProducts.Remove(soldP);
                }
                db.SaveChanges();
                Product prod = db.Products.Find(id);
                db.Products.Attach(prod);
                db.Products.Remove(prod);
                db.SaveChanges();
                return 1;
            }
        }
    }
}