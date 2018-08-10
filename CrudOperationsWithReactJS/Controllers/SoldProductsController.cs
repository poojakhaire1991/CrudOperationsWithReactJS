using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrudOperationsWithReactJS.Models;

namespace CrudOperationsWithReactJS.Controllers
{
    public class SoldProductsController : Controller
    {
        MarsOnboardingEntities1 db = new MarsOnboardingEntities1();
        // GET: SoldProducts
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetSoldProductData()
        {
            var SoldProd=db.SoldProducts.Select(x=> new{
                    Id = x.Id,
                    CustomerId = x.CustomerId,
                    Customer = x.Customer.FirstName,
                    ProductId = x.ProductId,
                    Product = x.Product.Name,
                    StoreId = x.StoreId,
                    Store = x.Store.Name,
                    DateSold = x.Date
            }).ToList();            
            return Json(SoldProd, JsonRequestBehavior.AllowGet);
        }
        public int CreateSoldProduct(SoldProduct SoldProduct)
        {
            using (db)
            {
                long id = db.SoldProducts.Max(x => x.Id);
                SoldProduct.Id = id + 1;
                db.SoldProducts.Add(SoldProduct);
                db.SaveChanges();
                return 1;
            }
        }
        public int UpdateSoldProduct(SoldProduct soldProduct)
        {
            using (db)
            {
                db.Entry(soldProduct).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return 1;
            }
        }
        public int DeleteSoldProduct(int id)
        {
            using (db)
            {
                SoldProduct soldProducts = db.SoldProducts.Find(id);
                db.SoldProducts.Remove(soldProducts);
                db.SaveChanges();
                return 1;
            }
        }
    }
}