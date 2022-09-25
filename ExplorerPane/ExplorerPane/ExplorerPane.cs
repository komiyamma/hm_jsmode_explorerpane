using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

using HmNetCOM;
using static HmNetCOM.Hm;

namespace ExplorerPane
{

    [ClassInterface(ClassInterfaceType.None)]
    [Guid("D49DB6BA-71FB-421A-81CC-40C2C3E0391A")]

    public class ExplorerPane : IExplorerPane
    {
        public int ExplorerPane_SendMessage(Object command_id)
        {
            try
            {
                int id = (int)(dynamic)(command_id);
                IntPtr ret = Hm.ExplorerPane.SendMessage(id);
                return ret.ToInt32();
            }
            catch (Exception e)
            {
                Hm.OutputPane.Output(e.Message + "\r\n");
            }
            return 0;
        }
    }

    public interface IExplorerPane
    {
        int ExplorerPane_SendMessage(Object command_id);
    }
}
