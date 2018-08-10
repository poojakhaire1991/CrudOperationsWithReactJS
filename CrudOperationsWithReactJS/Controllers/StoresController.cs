using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrudOperationsWithReactJS.Models;

namespace CrudOperationsWithReactJS.Controllers
{
    public class StoresController : Controller
    {
        MarsOnboardingEntities1 db = new MarsOnboardingEntities1();
        // GET: Stores
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetStoreData()
        {
            var Store = db.Stores.Select(x => new {
                StoreId=x.StoreId,
                Name=x.Name,
                Address=x.Address
            }).ToList();
            return Json(Store, JsonRequestBehavior.AllowGet);
        }
        public int CreateStore(Store store)
        {
            using (db)
            {
                long id = db.Stores.Max(x => x.StoreId);
                store.StoreId = id + 1;
                db.Stores.Add(store);
                db.SaveChanges();
                return 1;
            }
        }
        public int UpdateStore(Store store)
        {
            using (db)
            {
                db.Entry(store).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return 1;
            }
        }
        public int DeleteStore(int id)
        {
            using (db)
            {
                var sp = from s in db.SoldProducts where (s.StoreId == id) select s;
                foreach(var soldP in sp)
                {
                    db.SoldProducts.Remove(soldP);
                }
                db.SaveChanges();
                Store store = db.Stores.Find(id);
                db.Stores.Attach(store);
                db.Stores.Remove(store);
                db.SaveChanges();
                return 1;
            }
        }
    }
}